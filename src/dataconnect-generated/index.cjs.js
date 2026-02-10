const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'papernpencil',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createOrganizationalUnitRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrganizationalUnit', inputVars);
}
createOrganizationalUnitRef.operationName = 'CreateOrganizationalUnit';
exports.createOrganizationalUnitRef = createOrganizationalUnitRef;

exports.createOrganizationalUnit = function createOrganizationalUnit(dcOrVars, vars) {
  return executeMutation(createOrganizationalUnitRef(dcOrVars, vars));
};

const listMeetingsByOrganizerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMeetingsByOrganizer', inputVars);
}
listMeetingsByOrganizerRef.operationName = 'ListMeetingsByOrganizer';
exports.listMeetingsByOrganizerRef = listMeetingsByOrganizerRef;

exports.listMeetingsByOrganizer = function listMeetingsByOrganizer(dcOrVars, vars) {
  return executeQuery(listMeetingsByOrganizerRef(dcOrVars, vars));
};

const markAttendanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkAttendance', inputVars);
}
markAttendanceRef.operationName = 'MarkAttendance';
exports.markAttendanceRef = markAttendanceRef;

exports.markAttendance = function markAttendance(dcOrVars, vars) {
  return executeMutation(markAttendanceRef(dcOrVars, vars));
};

const getUserFinancialRecordsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserFinancialRecords');
}
getUserFinancialRecordsRef.operationName = 'GetUserFinancialRecords';
exports.getUserFinancialRecordsRef = getUserFinancialRecordsRef;

exports.getUserFinancialRecords = function getUserFinancialRecords(dc) {
  return executeQuery(getUserFinancialRecordsRef(dc));
};
