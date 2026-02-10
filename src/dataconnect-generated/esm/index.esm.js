import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'papernpencil',
  location: 'us-east4'
};

export const createOrganizationalUnitRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrganizationalUnit', inputVars);
}
createOrganizationalUnitRef.operationName = 'CreateOrganizationalUnit';

export function createOrganizationalUnit(dcOrVars, vars) {
  return executeMutation(createOrganizationalUnitRef(dcOrVars, vars));
}

export const listMeetingsByOrganizerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMeetingsByOrganizer', inputVars);
}
listMeetingsByOrganizerRef.operationName = 'ListMeetingsByOrganizer';

export function listMeetingsByOrganizer(dcOrVars, vars) {
  return executeQuery(listMeetingsByOrganizerRef(dcOrVars, vars));
}

export const markAttendanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkAttendance', inputVars);
}
markAttendanceRef.operationName = 'MarkAttendance';

export function markAttendance(dcOrVars, vars) {
  return executeMutation(markAttendanceRef(dcOrVars, vars));
}

export const getUserFinancialRecordsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserFinancialRecords');
}
getUserFinancialRecordsRef.operationName = 'GetUserFinancialRecords';

export function getUserFinancialRecords(dc) {
  return executeQuery(getUserFinancialRecordsRef(dc));
}

