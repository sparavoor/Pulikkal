'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const SignupSchema = z.object({
    username: z.string().min(10, "Mobile number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name is required"),
    role: z.string(),
    directorateRole: z.string().optional(),
    sectorName: z.string().optional(),
});

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/dashboard' });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut({ redirectTo: '/login' });
}

export async function signup(prevState: string | undefined, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = SignupSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return "Missing or invalid fields.";
    }

    const { username, password, name, role, directorateRole, sectorName } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return "User already exists.";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let sectorId = null;
    if (sectorName && (role === 'SECTOR_SECRETARY' || role === 'USER')) {
        const sector = await prisma.sector.findUnique({ where: { name: sectorName } });
        if (sector) {
            sectorId = sector.id;
        } else {
            return "Invalid Sector selected.";
        }
    }

    try {
        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                role,
                directorateRole: directorateRole || "NONE",
                sectorId,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return "Database Error: Failed to Create User.";
    }
}

// MEETING ACTIONS

const MeetingSchema = z.object({
    title: z.string().min(3),
    type: z.string(),
    date: z.string(),
    time: z.string(),
    participantRole: z.string().optional(),
    sectorId: z.string().optional(),
});

export async function createMeeting(prevState: string | undefined, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = MeetingSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return "Missing or invalid fields.";
    }

    const { title, type, date, time, participantRole, sectorId } = validatedFields.data;
    const dateObj = new Date(date);

    try {
        await prisma.meeting.create({
            data: {
                title,
                type,
                date: dateObj,
                time,
                participantRole: participantRole || null,
                sectorId: sectorId || null
            }
        });
        if (sectorId) {
            revalidatePath('/sector/meetings');
        } else {
            revalidatePath('/admin/meetings');
        }
        return "success";
    } catch (error) {
        console.error('Create meeting error:', error);
        return "Failed to create meeting.";
    }
}

export async function toggleAttendance(meetingId: string, memberId: string, status: boolean) {
    try {
        await prisma.attendance.upsert({
            where: {
                meetingId_memberId: {
                    meetingId,
                    memberId
                }
            },
            update: { status },
            create: { meetingId, memberId, status }
        });
        revalidatePath(`/admin/meetings/${meetingId}/attendance`);
        revalidatePath(`/sector/meetings/${meetingId}/attendance`); // Revalidate both paths
        return { success: true };
    } catch (error) {
        console.error('Toggle attendance error:', error);
        return { success: false, error: 'Failed to update attendance' };
    }
}

// PROJECT ACTIONS

const ProjectSchema = z.object({
    name: z.string().min(3),
    scheme: z.string(),
    scopeUnit: z.coerce.boolean(),
    scopeSector: z.coerce.boolean(),
});

export async function createProject(prevState: string | undefined, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const data = {
        name: rawFormData.name,
        scheme: rawFormData.scheme,
        scopeUnit: rawFormData.scopeUnit === 'on',
        scopeSector: rawFormData.scopeSector === 'on',
    };

    const validated = ProjectSchema.safeParse(data);

    if (!validated.success) {
        return "Missing or invalid fields.";
    }

    const { name, scheme, scopeUnit, scopeSector } = validated.data;

    try {
        await prisma.project.create({
            data: { name, scheme, scopeUnit, scopeSector }
        });
        revalidatePath('/admin/directorate');
        return "success";
    } catch (error) {
        console.error('Create project error:', error);
        return "Failed to create project.";
    }
}

// MEMBER ACTIONS

const MemberSchema = z.object({
    name: z.string().min(2),
    mobile: z.string().min(10),
    sectorId: z.string().optional().nullable(),
    unitId: z.string().optional().nullable(),
});

export async function createMember(prevState: string | undefined, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries()) as Record<string, any>;
    if (rawFormData.sectorId === '') rawFormData.sectorId = null;
    if (rawFormData.unitId === '') rawFormData.unitId = null;

    const validated = MemberSchema.safeParse(rawFormData);

    if (!validated.success) {
        return "Missing or invalid fields.";
    }

    const { name, mobile, sectorId, unitId } = validated.data;

    try {
        await prisma.member.create({
            data: {
                name,
                mobile,
                sectorId: sectorId || null,
                unitId: unitId || null
            }
        });
        revalidatePath('/admin/members');
        revalidatePath('/sector/members');
        return "success";
    } catch (error) {
        console.error('Create member error:', error);
        return "Failed to create member.";
    }
}

export async function deleteMember(memberId: string) {
    try {
        await prisma.member.delete({
            where: { id: memberId }
        });
        revalidatePath('/sector/members');
        revalidatePath('/admin/members');
        return { success: true };
    } catch (error) {
        console.error('Delete member error:', error);
        return { success: false, error: 'Failed to delete member' };
    }
}

// UNIT ACTIONS

const UnitSchema = z.object({
    name: z.string().min(2),
    sectorId: z.string().min(2, "Sector is required"),
});

export async function createUnit(prevState: string | undefined, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validated = UnitSchema.safeParse(rawFormData);

    if (!validated.success) {
        return "Missing or invalid fields.";
    }

    const { name, sectorId } = validated.data;

    try {
        await prisma.unit.create({
            data: { name, sectorId }
        });
        revalidatePath('/admin/sectors');
        revalidatePath('/admin/members');
        return "success";
    } catch (error) {
        console.error('Create unit error:', error);
        return "Failed to create unit.";
    }
}

export async function createUnitForSector(prevState: string | undefined, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validated = UnitSchema.safeParse(rawFormData);

    if (!validated.success) {
        return "Missing or invalid fields.";
    }

    const { name, sectorId } = validated.data;

    try {
        await prisma.unit.create({
            data: { name, sectorId }
        });
        revalidatePath('/sector/units');
        return "success";
    } catch (error) {
        console.error('Create unit for sector error:', error);
        return "Failed to create unit.";
    }
}


export async function deleteUnit(unitId: string) {
    try {
        await prisma.unit.delete({
            where: { id: unitId }
        });
        revalidatePath('/sector/units');
        revalidatePath('/admin/sectors');
        return { success: true };
    } catch (error) {
        console.error('Delete unit error:', error);
        return { success: false, error: 'Failed to delete unit' };
    }
}

// EVENT ACTIONS

const EventSchema = z.object({
    title: z.string().min(3),
    date: z.string(),
    description: z.string().optional(),
});

export async function createEvent(prevState: string | undefined, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validated = EventSchema.safeParse(rawFormData);

    if (!validated.success) {
        return "Missing or invalid fields.";
    }

    const { title, date, description } = validated.data;
    const dateObj = new Date(date);

    try {
        await prisma.event.create({
            data: {
                title,
                date: dateObj,
                description
            }
        });
        revalidatePath('/admin/events');
        revalidatePath('/');
        return "success";
    } catch (error) {
        console.error('Create event error:', error);
        return "Failed to create event.";
    }
}

export async function deleteEvent(eventId: string) {
    try {
        await prisma.event.delete({ where: { id: eventId } });
        revalidatePath('/admin/events');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete event error:', error);
        return { success: false, error: 'Failed to delete' };
    }
}

// FINANCE ACTIONS

const CashbookSchema = z.object({
    amount: z.coerce.number().min(1),
    type: z.string(), // INCOME / EXPENSE
    description: z.string().min(2),
    date: z.string(),
    sectorId: z.string().optional(),
    paymentMode: z.string().default('CASH'),
    categoryId: z.string().optional().nullable()
});

export async function createCashbookEntry(prevState: string | undefined, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    // Handle empty categoryId
    if (rawFormData.categoryId === '') {
        delete rawFormData.categoryId;
    }

    const validated = CashbookSchema.safeParse(rawFormData);

    if (!validated.success) {
        return "Missing or invalid fields.";
    }

    const { amount, type, description, date, sectorId, paymentMode, categoryId } = validated.data;
    const dateObj = new Date(date);

    try {
        await prisma.cashbookEntry.create({
            data: {
                amount,
                type,
                description,
                date: dateObj,
                paymentMode,
                categoryId: categoryId || null,
                // @ts-ignore
                sectorId: sectorId || null
            }
        });
        if (sectorId) {
            revalidatePath('/sector/finance');
        }
        revalidatePath('/admin/finance');
        revalidatePath('/portal/finance');
        return "success";
    } catch (error) {
        console.error('Create cashbook entry error:', error);
        return "Failed to create entry.";
    }
}

export async function deleteCashbookEntry(entryId: string) {
    try {
        await prisma.cashbookEntry.delete({
            where: { id: entryId }
        });
        revalidatePath('/sector/finance');
        revalidatePath('/admin/finance');
        revalidatePath('/portal/finance');
        return { success: true };
    } catch (error) {
        console.error('Delete cashbook entry error:', error);
        return { success: false, error: 'Failed to delete entry' };
    }
}

export async function createTransactionCategory(prevState: string | undefined, formData: FormData) {
    const schema = z.object({
        name: z.string().min(1),
        type: z.string(),
        sectorId: z.string().optional().nullable()
    });

    const rawFormData = Object.fromEntries(formData.entries());
    const validated = schema.safeParse(rawFormData);

    if (!validated.success) return "Invalid data";

    try {
        await prisma.transactionCategory.create({
            data: {
                name: validated.data.name,
                type: validated.data.type,
                sectorId: validated.data.sectorId || null
            }
        });
        if (validated.data.sectorId) {
            revalidatePath('/sector/finance');
        }
        // Always revalidate admin/portal as they see global categories
        revalidatePath('/admin/finance');
        revalidatePath('/portal/finance');
        // Also revalidate sector finance generally if it's a global category (sectorId is null)
        if (!validated.data.sectorId) {
            revalidatePath('/sector/finance');
        }
        return "success";
    } catch (e) {
        console.error('Create category error:', e);
        return "Failed to create category";
    }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        revalidatePath('/admin/users');
        return true;
    } catch (error) {
        console.error('Failed to delete user:', error);
        return false;
    }
}
