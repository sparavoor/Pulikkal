import { CreateOrganizationalUnitData, CreateOrganizationalUnitVariables, ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables, MarkAttendanceData, MarkAttendanceVariables, GetUserFinancialRecordsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateOrganizationalUnit(options?: useDataConnectMutationOptions<CreateOrganizationalUnitData, FirebaseError, CreateOrganizationalUnitVariables>): UseDataConnectMutationResult<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;
export function useCreateOrganizationalUnit(dc: DataConnect, options?: useDataConnectMutationOptions<CreateOrganizationalUnitData, FirebaseError, CreateOrganizationalUnitVariables>): UseDataConnectMutationResult<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;

export function useListMeetingsByOrganizer(vars: ListMeetingsByOrganizerVariables, options?: useDataConnectQueryOptions<ListMeetingsByOrganizerData>): UseDataConnectQueryResult<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;
export function useListMeetingsByOrganizer(dc: DataConnect, vars: ListMeetingsByOrganizerVariables, options?: useDataConnectQueryOptions<ListMeetingsByOrganizerData>): UseDataConnectQueryResult<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;

export function useMarkAttendance(options?: useDataConnectMutationOptions<MarkAttendanceData, FirebaseError, MarkAttendanceVariables>): UseDataConnectMutationResult<MarkAttendanceData, MarkAttendanceVariables>;
export function useMarkAttendance(dc: DataConnect, options?: useDataConnectMutationOptions<MarkAttendanceData, FirebaseError, MarkAttendanceVariables>): UseDataConnectMutationResult<MarkAttendanceData, MarkAttendanceVariables>;

export function useGetUserFinancialRecords(options?: useDataConnectQueryOptions<GetUserFinancialRecordsData>): UseDataConnectQueryResult<GetUserFinancialRecordsData, undefined>;
export function useGetUserFinancialRecords(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserFinancialRecordsData>): UseDataConnectQueryResult<GetUserFinancialRecordsData, undefined>;
