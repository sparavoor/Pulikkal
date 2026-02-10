# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListMeetingsByOrganizer*](#listmeetingsbyorganizer)
  - [*GetUserFinancialRecords*](#getuserfinancialrecords)
- [**Mutations**](#mutations)
  - [*CreateOrganizationalUnit*](#createorganizationalunit)
  - [*MarkAttendance*](#markattendance)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListMeetingsByOrganizer
You can execute the `ListMeetingsByOrganizer` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMeetingsByOrganizer(vars: ListMeetingsByOrganizerVariables): QueryPromise<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;

interface ListMeetingsByOrganizerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMeetingsByOrganizerVariables): QueryRef<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;
}
export const listMeetingsByOrganizerRef: ListMeetingsByOrganizerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMeetingsByOrganizer(dc: DataConnect, vars: ListMeetingsByOrganizerVariables): QueryPromise<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;

interface ListMeetingsByOrganizerRef {
  ...
  (dc: DataConnect, vars: ListMeetingsByOrganizerVariables): QueryRef<ListMeetingsByOrganizerData, ListMeetingsByOrganizerVariables>;
}
export const listMeetingsByOrganizerRef: ListMeetingsByOrganizerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMeetingsByOrganizerRef:
```typescript
const name = listMeetingsByOrganizerRef.operationName;
console.log(name);
```

### Variables
The `ListMeetingsByOrganizer` query requires an argument of type `ListMeetingsByOrganizerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMeetingsByOrganizerVariables {
  organizerId: UUIDString;
}
```
### Return Type
Recall that executing the `ListMeetingsByOrganizer` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMeetingsByOrganizerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMeetingsByOrganizerData {
  meetings: ({
    id: UUIDString;
    title: string;
    startTime: TimestampString;
    endTime: TimestampString;
    location?: string | null;
  } & Meeting_Key)[];
}
```
### Using `ListMeetingsByOrganizer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMeetingsByOrganizer, ListMeetingsByOrganizerVariables } from '@dataconnect/generated';

// The `ListMeetingsByOrganizer` query requires an argument of type `ListMeetingsByOrganizerVariables`:
const listMeetingsByOrganizerVars: ListMeetingsByOrganizerVariables = {
  organizerId: ..., 
};

// Call the `listMeetingsByOrganizer()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMeetingsByOrganizer(listMeetingsByOrganizerVars);
// Variables can be defined inline as well.
const { data } = await listMeetingsByOrganizer({ organizerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMeetingsByOrganizer(dataConnect, listMeetingsByOrganizerVars);

console.log(data.meetings);

// Or, you can use the `Promise` API.
listMeetingsByOrganizer(listMeetingsByOrganizerVars).then((response) => {
  const data = response.data;
  console.log(data.meetings);
});
```

### Using `ListMeetingsByOrganizer`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMeetingsByOrganizerRef, ListMeetingsByOrganizerVariables } from '@dataconnect/generated';

// The `ListMeetingsByOrganizer` query requires an argument of type `ListMeetingsByOrganizerVariables`:
const listMeetingsByOrganizerVars: ListMeetingsByOrganizerVariables = {
  organizerId: ..., 
};

// Call the `listMeetingsByOrganizerRef()` function to get a reference to the query.
const ref = listMeetingsByOrganizerRef(listMeetingsByOrganizerVars);
// Variables can be defined inline as well.
const ref = listMeetingsByOrganizerRef({ organizerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMeetingsByOrganizerRef(dataConnect, listMeetingsByOrganizerVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.meetings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.meetings);
});
```

## GetUserFinancialRecords
You can execute the `GetUserFinancialRecords` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserFinancialRecords(): QueryPromise<GetUserFinancialRecordsData, undefined>;

interface GetUserFinancialRecordsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserFinancialRecordsData, undefined>;
}
export const getUserFinancialRecordsRef: GetUserFinancialRecordsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserFinancialRecords(dc: DataConnect): QueryPromise<GetUserFinancialRecordsData, undefined>;

interface GetUserFinancialRecordsRef {
  ...
  (dc: DataConnect): QueryRef<GetUserFinancialRecordsData, undefined>;
}
export const getUserFinancialRecordsRef: GetUserFinancialRecordsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserFinancialRecordsRef:
```typescript
const name = getUserFinancialRecordsRef.operationName;
console.log(name);
```

### Variables
The `GetUserFinancialRecords` query has no variables.
### Return Type
Recall that executing the `GetUserFinancialRecords` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserFinancialRecordsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserFinancialRecordsData {
  financialRecords: ({
    id: UUIDString;
    amount: number;
    createdAt: TimestampString;
    description?: string | null;
    type: string;
  } & FinancialRecord_Key)[];
}
```
### Using `GetUserFinancialRecords`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserFinancialRecords } from '@dataconnect/generated';


// Call the `getUserFinancialRecords()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserFinancialRecords();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserFinancialRecords(dataConnect);

console.log(data.financialRecords);

// Or, you can use the `Promise` API.
getUserFinancialRecords().then((response) => {
  const data = response.data;
  console.log(data.financialRecords);
});
```

### Using `GetUserFinancialRecords`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserFinancialRecordsRef } from '@dataconnect/generated';


// Call the `getUserFinancialRecordsRef()` function to get a reference to the query.
const ref = getUserFinancialRecordsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserFinancialRecordsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.financialRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.financialRecords);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateOrganizationalUnit
You can execute the `CreateOrganizationalUnit` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createOrganizationalUnit(vars: CreateOrganizationalUnitVariables): MutationPromise<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;

interface CreateOrganizationalUnitRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrganizationalUnitVariables): MutationRef<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;
}
export const createOrganizationalUnitRef: CreateOrganizationalUnitRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOrganizationalUnit(dc: DataConnect, vars: CreateOrganizationalUnitVariables): MutationPromise<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;

interface CreateOrganizationalUnitRef {
  ...
  (dc: DataConnect, vars: CreateOrganizationalUnitVariables): MutationRef<CreateOrganizationalUnitData, CreateOrganizationalUnitVariables>;
}
export const createOrganizationalUnitRef: CreateOrganizationalUnitRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOrganizationalUnitRef:
```typescript
const name = createOrganizationalUnitRef.operationName;
console.log(name);
```

### Variables
The `CreateOrganizationalUnit` mutation requires an argument of type `CreateOrganizationalUnitVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateOrganizationalUnitVariables {
  name: string;
  description?: string | null;
}
```
### Return Type
Recall that executing the `CreateOrganizationalUnit` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrganizationalUnitData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrganizationalUnitData {
  organizationalUnit_insert: OrganizationalUnit_Key;
}
```
### Using `CreateOrganizationalUnit`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOrganizationalUnit, CreateOrganizationalUnitVariables } from '@dataconnect/generated';

// The `CreateOrganizationalUnit` mutation requires an argument of type `CreateOrganizationalUnitVariables`:
const createOrganizationalUnitVars: CreateOrganizationalUnitVariables = {
  name: ..., 
  description: ..., // optional
};

// Call the `createOrganizationalUnit()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrganizationalUnit(createOrganizationalUnitVars);
// Variables can be defined inline as well.
const { data } = await createOrganizationalUnit({ name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrganizationalUnit(dataConnect, createOrganizationalUnitVars);

console.log(data.organizationalUnit_insert);

// Or, you can use the `Promise` API.
createOrganizationalUnit(createOrganizationalUnitVars).then((response) => {
  const data = response.data;
  console.log(data.organizationalUnit_insert);
});
```

### Using `CreateOrganizationalUnit`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOrganizationalUnitRef, CreateOrganizationalUnitVariables } from '@dataconnect/generated';

// The `CreateOrganizationalUnit` mutation requires an argument of type `CreateOrganizationalUnitVariables`:
const createOrganizationalUnitVars: CreateOrganizationalUnitVariables = {
  name: ..., 
  description: ..., // optional
};

// Call the `createOrganizationalUnitRef()` function to get a reference to the mutation.
const ref = createOrganizationalUnitRef(createOrganizationalUnitVars);
// Variables can be defined inline as well.
const ref = createOrganizationalUnitRef({ name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrganizationalUnitRef(dataConnect, createOrganizationalUnitVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.organizationalUnit_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.organizationalUnit_insert);
});
```

## MarkAttendance
You can execute the `MarkAttendance` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
markAttendance(vars: MarkAttendanceVariables): MutationPromise<MarkAttendanceData, MarkAttendanceVariables>;

interface MarkAttendanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAttendanceVariables): MutationRef<MarkAttendanceData, MarkAttendanceVariables>;
}
export const markAttendanceRef: MarkAttendanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markAttendance(dc: DataConnect, vars: MarkAttendanceVariables): MutationPromise<MarkAttendanceData, MarkAttendanceVariables>;

interface MarkAttendanceRef {
  ...
  (dc: DataConnect, vars: MarkAttendanceVariables): MutationRef<MarkAttendanceData, MarkAttendanceVariables>;
}
export const markAttendanceRef: MarkAttendanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markAttendanceRef:
```typescript
const name = markAttendanceRef.operationName;
console.log(name);
```

### Variables
The `MarkAttendance` mutation requires an argument of type `MarkAttendanceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkAttendanceVariables {
  meetingId: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `MarkAttendance` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkAttendanceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkAttendanceData {
  attendance_insert: Attendance_Key;
}
```
### Using `MarkAttendance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markAttendance, MarkAttendanceVariables } from '@dataconnect/generated';

// The `MarkAttendance` mutation requires an argument of type `MarkAttendanceVariables`:
const markAttendanceVars: MarkAttendanceVariables = {
  meetingId: ..., 
  status: ..., 
};

// Call the `markAttendance()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markAttendance(markAttendanceVars);
// Variables can be defined inline as well.
const { data } = await markAttendance({ meetingId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markAttendance(dataConnect, markAttendanceVars);

console.log(data.attendance_insert);

// Or, you can use the `Promise` API.
markAttendance(markAttendanceVars).then((response) => {
  const data = response.data;
  console.log(data.attendance_insert);
});
```

### Using `MarkAttendance`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markAttendanceRef, MarkAttendanceVariables } from '@dataconnect/generated';

// The `MarkAttendance` mutation requires an argument of type `MarkAttendanceVariables`:
const markAttendanceVars: MarkAttendanceVariables = {
  meetingId: ..., 
  status: ..., 
};

// Call the `markAttendanceRef()` function to get a reference to the mutation.
const ref = markAttendanceRef(markAttendanceVars);
// Variables can be defined inline as well.
const ref = markAttendanceRef({ meetingId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markAttendanceRef(dataConnect, markAttendanceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attendance_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attendance_insert);
});
```

