import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Attendance_Key {
  id: UUIDString;
  __typename?: 'Attendance_Key';
}

export interface CreateOrganizationalUnitData {
  organizationalUnit_insert: OrganizationalUnit_Key;
}

export interface CreateOrganizationalUnitVariables {
  name: string;
  description?: string | null;
}

export interface FinancialRecord_Key {
  id: UUIDString;
  __typename?: 'FinancialRecord_Key';
}

export interface GetUserFinancialRecordsData {
  financialRecords: ({
    id: UUIDString;
    amount: number;
    createdAt: TimestampString;
    description?: string | null;
    type: string;
  } & FinancialRecord_Key)[];
}

export interface ListMeetingsByOrganizerData {
  meetings: ({
    id: UUIDString;
    title: string;
    startTime: TimestampString;
    endTime: TimestampString;
    location?: string | null;
  } & Meeting_Key)[];
}

export interface ListMeetingsByOrganizerVariables {
  organizerId: UUIDString;
}

export interface MarkAttendanceData {
  attendance_insert: Attendance_Key;
}

export interface MarkAttendanceVariables {
  meetingId: UUIDString;
  status: string;
}

export interface Meeting_Key {
  id: UUIDString;
  __typename?: 'Meeting_Key';
}

export interface OrganizationalUnit_Key {
  id: UUIDString;
  __typename?: 'OrganizationalUnit_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateOrganizationalUnitRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrganizationalUnitVariables): MutationRef<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrganizationalUnitVariables): MutationRef<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;
  operationName: string;
}
export const createOrganizationalUnitRef: CreateOrganizationalUnitRef;

export function createOrganizationalUnit(vars: CreateOrganizationalUnitVariables): MutationPromise<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;
export function createOrganizationalUnit(dc: DataConnect, vars: CreateOrganizationalUnitVariables): MutationPromise<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;

interface ListMeetingsByOrganizerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMeetingsByOrganizerVariables): QueryRef<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMeetingsByOrganizerVariables): QueryRef<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;
  operationName: string;
}
export const listMeetingsByOrganizerRef: ListMeetingsByOrganizerRef;

export function listMeetingsByOrganizer(vars: ListMeetingsByOrganizerVariables): QueryPromise<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;
export function listMeetingsByOrganizer(dc: DataConnect, vars: ListMeetingsByOrganizerVariables): QueryPromise<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;

interface MarkAttendanceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAttendanceVariables): MutationRef<MarkAttendanceData, MarkAttendanceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkAttendanceVariables): MutationRef<MarkAttendanceData, MarkAttendanceVariables>;
  operationName: string;
}
export const markAttendanceRef: MarkAttendanceRef;

export function markAttendance(vars: MarkAttendanceVariables): MutationPromise<MarkAttendanceData, MarkAttendanceVariables>;
export function markAttendance(dc: DataConnect, vars: MarkAttendanceVariables): MutationPromise<MarkAttendanceData, MarkAttendanceVariables>;

interface GetUserFinancialRecordsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserFinancialRecordsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserFinancialRecordsData, undefined>;
  operationName: string;
}
export const getUserFinancialRecordsRef: GetUserFinancialRecordsRef;

export function getUserFinancialRecords(): QueryPromise<GetUserFinancialRecordsData, undefined>;
export function getUserFinancialRecords(dc: DataConnect): QueryPromise<GetUserFinancialRecordsData, undefined>;

