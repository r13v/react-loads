# React Loads

> A zero-dependency React utility to help with promise state & response data.

# The problem

There are a few concerns in managing async data fetching manually:

- Managing loading state can be annoying and prone to a confusing user experience if you aren't careful.
- Managing data persistence across page transitions can be easily overlooked.
- Flashes of loading state & no feedback on something that takes a while to load can be annoying.
- Nested ternaries can get messy and hard to read. Example:

```jsx
<Fragment>
  {isPending ? (
    <p>{hasTimedOut ? 'Taking a while...' : 'Loading...'}</p>
  ) : (
    <Fragment>
      {!error && !response && <button onClick={this.handleLoad}>Click here to load!</button>}
      {response && <p>{response}</p>}
      {error && <p>{error.message}</p>}
    </Fragment>
  )}
</Fragment>
```

# The solution

React Loads comes with a handy set of features to help solve these concerns:

- Manage your async data & states with a declarative syntax with [React Hooks](https://reactjs.org/docs/hooks-intro.html) or [Render Props](#children-render-props)
- Predictable outcomes with deterministic [state variables](#isidle) or [state components](#usage-with-state-components) to avoid messy state ternaries
- Invoke your loading function **on initial render** and/or [on demand](#defer)
- Pass any type of promise to your [loading function](#load)
- Hoist your loading functions into [resources](#resources) for built-in cache support & reusability
- Add a [delay](#delay) to prevent flashes of loading state
- Add a [timeout](#timeout) to provide feedback when your loading function is taking a while to resolve
- [Data caching](#caching-response-data) enabled by default to maximise user experience between page transitions
- Tell Loads [how to load](#loadpolicy) your data from the cache to prevent unnessessary invocations
- [External cache](#external-cache) support to enable something like local storage caching
- [Optimistic responses](#optimistic-responses) to update your UI optimistically

# Table of contents

- [React Loads](#react-loads)
- [The problem](#the-problem)
- [The solution](#the-solution)
- [Table of contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
  - [FIRSTLY](#firstly)
  - [With Hooks](#with-hooks)
  - [With Render Props](#with-render-props)
  - [See a demo](#see-a-demo)
  - [More examples](#more-examples)
- [Guides](#guides)
  - [Resources (API)](#resources-api)
  - [Caching response data](#caching-response-data)
    - [Basic cache](#basic-cache)
  - [External cache](#external-cache)
    - [Global cache provider](#global-cache-provider)
    - [Local cache provider](#local-cache-provider)
  - [Optimistic responses](#optimistic-responses)
    - [setResponse(data[, opts[, callback]]) / setError(data[, opts[, callback]])](#setresponsedata-opts-callback--seterrordata-opts-callback)
    - [Basic example](#basic-example)
    - [Example updating another `useLoads` optimistically](#example-updating-another-useloads-optimistically)
  - [Updating resources](#updating-resources)
  - [Concurrent React (Experimental)](#concurrent-react-experimental)
- [API](#api)
  - [`loader = useLoads(load[, config[, inputs]])`](#loader--useloadsload-config-inputs)
    - [load](#load)
    - [config](#config)
        - [defer](#defer)
        - [delay](#delay)
        - [context](#context)
        - [id](#id)
        - [args](#args)
        - [timeout](#timeout)
        - [loadPolicy](#loadpolicy)
        - [enableBackgroundStates](#enablebackgroundstates)
        - [cacheProvider](#cacheprovider)
        - [update](#update)
    - [`loader`](#loader)
        - [response](#response)
        - [error](#error)
        - [load](#load-1)
        - [update](#update-1)
        - [isIdle](#isidle)
        - [isPending](#ispending)
        - [isTimeout](#istimeout)
        - [isResolved](#isresolved)
        - [isRejected](#isrejected)
        - [Idle](#idle)
        - [Pending](#pending)
        - [Timeout](#timeout)
        - [Resolved](#resolved)
        - [Rejected](#rejected)
        - [isCached](#iscached)
    - [`<Loads>` Props](#loads-props)
    - [load](#load-2)
    - [inputs](#inputs)
    - [defer](#defer-1)
    - [delay](#delay-1)
    - [context](#context-1)
    - [timeout](#timeout-1)
    - [loadPolicy](#loadpolicy-1)
    - [enableBackgroundStates](#enablebackgroundstates-1)
    - [cacheProvider](#cacheprovider-1)
    - [update](#update-2)
  - [`<Loads>` Render Props](#loads-render-props)
    - [response](#response-1)
    - [error](#error-1)
    - [load](#load-3)
    - [update](#update-3)
    - [isIdle](#isidle-1)
    - [isPending](#ispending-1)
    - [isTimeout](#istimeout-1)
    - [isResolved](#isresolved-1)
    - [isRejected](#isrejected-1)
    - [Idle](#idle-1)
    - [Pending](#pending-1)
    - [Timeout](#timeout-1)
    - [Resolved](#resolved-1)
    - [Rejected](#rejected-1)
    - [isCached](#iscached-1)
  - [`resource = createResource(options)`](#resource--createresourceoptions)
    - [options](#options)
      - [_namespace](#namespace)
      - [load](#load-4)
      - [any key is a loading function!](#any-key-is-a-loading-function)
    - [`resource`](#resource)
  - [`cache = useLoadsCache(context)`](#cache--useloadscachecontext)
    - [context](#context-2)
    - [`cache`](#cache)
    - [Example](#example)
- [Articles](#articles)
- [Happy customers](#happy-customers)
- [License](#license)

# Installation

```
npm install react-loads --save
```

or install with [Yarn](https://yarnpkg.com) if you prefer:

```
yarn add react-loads
```

# Usage

## FIRSTLY

Wrap your app in a `<LoadsContext.Provider>`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { LoadsContext } from 'react-loads';

ReactDOM.render(
  <LoadsContext.Provider>
    {/* ... */}
  <LoadsContext.Provider>
)
```

## With Hooks

[See the `useLoads` API](#useloadsload-config-inputs)

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const getRandomDog = React.useCallback(() => {
    return axios.get('https://dog.ceo/api/breeds/image/random')
  }, []);
  const { response, error, load, isRejected, isPending, isResolved } = useLoads(getRandomDog);

  return (
    <div>
      {isPending && <div>loading...</div>}
      {isResolved && (
        <div>
          <div>
            <img src={response.data.message} width="300px" alt="Dog" />
          </div>
          <button onClick={load}>Load another</button>
        </div>
      )}
      {isRejected && <div type="danger">{error.message}</div>}
    </div>
  );
}
```

> IMPORTANT NOTE: You must provide `useLoads` with a memoized promise (via **`React.useCallback`** or **bounded outside of your function component**), otherwise `useLoads` will be invoked on every render.
>
>If you are using `React.useCallback`, the [`react-hooks` ESLint Plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) is incredibly handy to ensure your hook dependencies are set up correctly.

## With Render Props

[See the `<Loads>` API](#useloadsload-config-inputs)

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

class DogApp extends React.Component {
  getRandomDog = () => {
    return axios.get('https://dog.ceo/api/breeds/image/random');
  }

  render = () => {
    return (
      <Loads load={this.getRandomDog}>
        {({ response, error, load, isRejected, isPending, isResolved }) => (
          <div>
            {isPending && <div>loading...</div>}
            {isResolved && (
              <div>
                <div>
                  <img src={response.data.message} width="300px" alt="Dog" />
                </div>
                <button onClick={load}>Load another</button>
              </div>
            )}
            {isRejected && <div type="danger">{error.message}</div>}
          </div>
        )}
      </Loads>
    )
  }
}
```

## [See a demo](https://jxom.github.io/react-loads/)

## More examples

- [Stories](./src/__stories__/index.stories.js)
- [Tests](./src/__tests__/useLoads.test.tsx)

# Guides

## Resources ([API](#resource--createresourceoptions))

For loading functions which may be used & invoked in many parts of your application, it may make sense to hoist and encapsulate them into resources.
A resource consists of one (or more) loading function as well as an optional namespace if you want to enable caching.

Below is an example of a resource and it's usage:

```jsx
import React from 'react';
import * as Loads from 'react-loads';

// 1. Define your loading function.
async function getUsers() {
  const response = await fetch('/users');
  const users = await response.json();
  return users;
}

// 2. Create your resource, and attach the loading function.
const usersResource = Loads.createResource({
  _namespace: 'users',
  load: getUsers
});

function MyComponent() {
  // 3. Invoke the useLoads function in your resource.
  const getUsersLoader = usersResource.useLoads();

  // 4. Use the loader variables:
  const users = getUsersLoader.response || [];
  return (
    <div>
      {getUsersLoader.isPending && 'loading...'}
      {getUsersLoader.isResolved && (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

You can attach more than one loading function to a resource. **But it's return value must be the same schema, as every response will update the cache.**.

You can also provide an array of 2 items to the resource creator (seen below with `delete`); the first item being the loading function, and the second being the [loading config](#config).

Here is an extended example using a resource with multiple loading functions, split into two files (`resources/users.js` & `index.js`):

### `resources/users.js`
```jsx
import * as Loads from 'react-loads';

async function getUser(id) {
  const response = await fetch(`/users/${id}`);
  const user = await response.json();
  return user;
}

async function updateUser(id, data, { cachedRecord }) {
  await fetch(`/users/${id}`, {
    method: 'post',
    body: JSON.stringify(data)
  });
  // `cachedRecord` is the record that's currently stored in the cache.
  const currentUser = cachedRecord.response;
  const updatedUser = { ...currentUser, ...data };
  return updatedUser;
}

async function deleteUser(id) {
  await fetch(`/users/${id}`, { method: 'delete' });
  return;
}

export default Loads.createResource({
  _namespace: 'user',
  load: getUser,
  // You can supply either a loading function, or an array of loading function/config pairs.
  create: [updateUser, { defer: true }],
  delete: [deleteUser, { defer: true }]
});
```

### `index.js`

```jsx
import React from 'react';

import AddUserForm from './AddUserForm';
import usersResource from './resources/users';

function MyComponent(props) {
  const { userId } = props;

  /**
   * For singular resources, it's important to supply an `id` so it can
   * be stored/retrieved from it's own respective cache record. If an `id`
   * is not supplied, then it will use the "user" cache record for every user,
   * meaning "user" will be overridden with different users.
   */
  const getUserLoader = usersResource.useLoads({
    id: userId,
    args: [userId]
  });
  const user = getUserLoader.response || {};

  const updateUserLoader = usersResource.create.useLoads({ id: userId });

  const deleteUserLoader = usersResource.delete.useLoads({ id: userId, args: [userId] });

  return (
    <div>
      {getUserLoader.isPending && 'loading...'}
      {getUserLoader.isResolved && (
        <div>
          Username: {user.name}

          <DeleteUserButton
            isLoading={deleteUserLoader.isPending}
            onClick={deleteUserLoader.load}
          />

          <UpdateUserForm onSubmit={data => updateUserLoader.load(userId, data)} />
        </div>
      )}
    </div>
  )
}
```

## Caching response data

### Basic cache

React Loads has the ability to cache the response and error data. The cached data will persist while the application is mounted, however, will clear when the application is unmounted (on page refresh or window close). Here is an example to use it:

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
  const { response, error, load, Pending, Resolved, Rejected } = useLoads(getRandomDog, { context: 'random-dog' });

  return (
    <div>
      {isPending && 'Loading...'}
      {isResolved && (
        <div>
          <img src={response.data.message} width="300px" alt="Dog" />
          <button onClick={load}>Load another</button>
        </div>
      )}
      {isRejected && (
        <div>{error.message}</div>
      )}
    </div>
  );
}
```

> NOTE: If you are using [resources](#resources), and provide a namespace (`_namespace`). Then caching comes for free.

## External cache

### Global cache provider

If you would like the ability to persist response data upon unmounting the application (e.g. page refresh or closing window), a cache provider can also be utilised to cache response data.

Here is an example using [Store.js](https://github.com/marcuswestin/store.js/) and setting the cache provider on an application level using `<LoadsContext.Provider>`. If you would like to set a cache provider on a hooks level with `useLoads`, see [Local cache provider](#local-cache-provider).

`index.js`
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { LoadsContext } from 'react-loads';

const cacheProvider = {
  get: key => store.get(key),
  set: (key, val) => store.set(key, val)
  reset: () => store.clearAll()
}

ReactDOM.render(
  <LoadsContext.Provider cacheProvider={cacheProvider}>
    {/* ... */}
  </LoadsContext.Provider>
)
```

### Local cache provider

A cache provider can also be specified on a component level with `useLoads`. If a `cacheProvider` is provided to `useLoads`, it will override the global cache provider if one is already set.

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

const cacheProvider = {
  get: key => store.get(key),
  set: (key, val) => store.set(key, val),
  reset: () => store.clearAll()
}

export default function DogApp() {
  const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
  const { response, error, load, Pending, Resolved, Rejected } = useLoads(getRandomDog, {
    cacheProvider,
    context: 'random-dog'
  });

  return (
    <div>
      {isPending && 'Loading...'}
      {isResolved && (
        <div>
          <img src={response.data.message} width="300px" alt="Dog" />
          <button onClick={load}>Load another</button>
        </div>
      )}
      {isRejected && (
        <div>{error.message}</div>
      )}
    </div>
  );
}
```

## Optimistic responses

React Loads has the ability to optimistically update your data while it is still waiting for a response (if you know what the response will potentially look like). Once a response is received, then the optimistically updated data will be replaced by the response. [This article](https://uxplanet.org/optimistic-1000-34d9eefe4c05) explains the gist of optimistic UIs pretty well.

The `setResponse` and `setError` functions are provided as the last argument of your loading function (`load`). The interface for these functions, along with an example implementation are seen below.

### setResponse(data[, opts[, callback]]) / setError(data[, opts[, callback]])

Optimistically sets a successful response or error.

#### data

> `Object` or `function(currentData) {}` | required

The updated data. If a function is provided, then the first argument will be the current loaded (or cached) data.

#### opts

> `Object{ context }`

##### opts.context

> `string` | optional

The context where the data will be updated. If not provided, then it will use the `context` prop specified in `useLoads`. If a `context` is provided, it will update the responses of all `useLoads` using that context immediately.

#### callback

> function(currentData) {}

A callback can be also provided as a *second or third* parameter to `setResponse`, where the first and only parameter is the current loaded (or cached) response (`currentData`).

### Basic example

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const getRandomDog = React.useCallback(({ setResponse }) => {
    setResponse({ data: { message: 'https://images.dog.ceo/breeds/doberman/n02107142_17147.jpg' } })
    return axios.get('https://dog.ceo/api/breeds/image/random');
  }, []);
  const { response, error, load, isRejected, isPending, isResolved } = useLoads(getRandomDog);

  return (
    <div>
      {isPending && 'Loading...'}
      {isResolved && (
        <div>
          <img src={response.data.message} width="300px" alt="Dog" />
          <button onClick={load}>Load another</button>
        </div>
      )}
      {isRejected && (
        <div>{error.message}</div>
      )}
    </div>
  );
}
```

### Example updating another `useLoads` optimistically

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const createDog = React.useCallback(async (dog, { setResponse }) => {
    setResponse(dog, { context: 'dog' });
    // ... - create the dog
  }, [])
  const createDogLoader = useLoads(createDog, { defer: true });

  const getDog = React.useCallback(async () {
    // ... - fetch and return the dog
  }, []);
  const getDogLoader = useLoads(getDog, { context: 'dog' });

  return (
    <React.Fragment>
      <button onClick={() => createDogLoader.load({ name: 'Teddy', breed: 'Groodle' })}>Create</button>
      {getDogLoader.response && <div>{getDogLoader.response.name}</div>}
    </React.Fragment>
  )
}
```

## Updating resources

Instead of using multiple `useLoads`'s to provide a way to update/amend a resource, you are able to specify an `update` function which mimics the `load` function. In order to use the `update` function, you must have a `load` function which shares the same response schema as your `update` function.

Here's an example of how you could use an update function:

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
  const getRandomDoberman = React.useCallback(() => axios.get('https://dog.ceo/api/breed/doberman/images/random'), []);
  const getRandomPoodle = React.useCallback(() => axios.get('https://dog.ceo/api/breed/poodle/images/random'), []);
  const {
    response,
    load,
    update: [loadDoberman, loadPoodle],
    isPending,
    isResolved
  } = useLoads(getRandomDog, {
    update: [getRandomDoberman, getRandomPoodle]
  });

  return (
    <div>
      {isPending && 'Loading...'}
      {isResolved && (
        <div>
          <div>
            <img src={response.data.message} width="300px" alt="Dog" />
          </div>
          <button onClick={load}>Load another random dog</button>
          <button onClick={loadDoberman}>Load doberman</button>
          <button onClick={loadPoodle}>Load poodle</button>
        </div>
      )}
    </div>
  );
}
```

## Concurrent React (Experimental)

React Loads supports [Concurrent React & Suspense](https://reactjs.org/docs/concurrent-mode-intro.html). Concurrent features in React Loads are only supported in [resources](#resources-apiresource--createresourceoptions) and can be used with the `unstable_load` function:

> Note: in order to use these features, you must be running [experimental React](https://reactjs.org/docs/concurrent-mode-adoption.html).

```jsx
import React from 'react';
import * as Loads from 'react-loads';

// 1. Define your loading function.
async function getUsers() {
  const response = await fetch('/users');
  const users = await response.json();
  return users;
}

// 2. Create a resource.
const usersResource = Loads.createResource({
  _namespace: 'users',
  load: getUsers
});

function UsersList() {
  // 3. Invoke your loading function.
  const users = usersResource.unstable_load();

  // 5. Once the loading function has resolved, the list will render.
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  )
}

function App() {
  // 4. Wrap your UsersList in a <Suspense> to "catch" the loading state.
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UsersList />
    </React.Suspense>
  )
}
```

### [See the example](./examples/with-concurrent-react)

# API

## `loader = useLoads(load[, config[, inputs]])`

> returns [an object (`loader`)](#loader)

### load

> `function(...args, { cachedRecord, setResponse, setError })` | returns `Promise` | required

The function to invoke. **It must return a promise.**

The argument `cachedRecord` is the stored record in the cache (if exists). It uses the [`context` option](#context) to retrieve the cache record.

The arguments `setResponse` & `setError` are optional and are used for optimistic responses. [Read more on optimistic responses](#optimistic-responses).

### config

##### defer

> `boolean` | default: `false`

By default, the loading function will be invoked on initial render. However, if you want to defer the loading function (call the loading function at another time), then you can set `defer` to true.

> If `defer` is set to true, the initial loading state will be `"idle"`.

Example:

```jsx
const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
const {
  response,
  error,
  load,
  isIdle,
  isPending,
  isResolved,
  isRejected
} = useLoads(getRandomDog, { defer: true });

return (
  <div>
    {isIdle && <button onClick={load}>Load dog</button>}
    {isPending && 'Loading...'}
    {isResolved && (
      <div>
        <img src={response.data.message} width="300px" alt="Dog" />
        <button onClick={load}>Load another</button>
      </div>
    )}
    {isRejected && (
      <div>{error.message}</div>
    )}
  </div>
);
```

##### delay

> `number` | default: `0`

Number of milliseconds before the component transitions to the `'pending'` state upon invoking `load`.

##### context

> `string`

Unique identifier for the promise (`load`). Enables the ability to [persist the response data](#caching-response-data). If `context` changes, then `load` will be invoked again.

##### id

> `string | Array<string>` | Used only with [resources](#resources-apiresource--createresourceoptions)

A unique ID to associate with a resource. This ID is used in conjunction with the resource's namespace to set and retrieve the value from the cache.

You can provide a unique string, or an array of unique strings.

##### args

> `Array<any>` | Used only with [resources](#resources-apiresource--createresourceoptions)

The default arguments to supply to the resource's loading function.

##### timeout

> `number` | default: `0`

Number of milliseconds before the component transitions to the `'timeout'` state. Set to `0` to disable.

_Note: `load` will still continue to try an resolve while in the `'timeout'` state_

##### loadPolicy

> `"cache-first" | "cache-and-load" | "load-only"` | default: `"cache-and-load"`

A load policy allows you to specify whether or not you want your data to be resolved from the Loads cache and how it should load the data.

- `"cache-first"`: If a value for the promise already exists in the Loads cache, then Loads will return the value that is in the cache, otherwise it will invoke the promise.

- `"cache-and-load"`: This is the default value and means that Loads will return with the cached value if found, but regardless of whether or not a value exists in the cache, it will always invoke the promise.

- `"load-only"`: This means that Loads will not return the cached data altogether, and will only return the data resolved from the promise.

##### enableBackgroundStates

> `boolean` | default: `false`

If true and the data is in cache, `isIdle`, `isPending` and `isTimeout` will be evaluated on subsequent loads. When `false` (default), these states are only evaluated on initial load and are falsy on subsequent loads - this is helpful if you want to show the cached response and not have a idle/pending/timeout indicator when `load` is invoked again. You must have a `context` set to enable background states as it only effects data in the cache.

##### cacheProvider

> `Object({ get: function(key), set: function(key, val), reset: function() })`

Set a custom cache provider (e.g. local storage, session storate, etc). See [external cache](#external-cache) below for an example.

##### update

`function(...args, { setResponse, setError })` | returns `Promise | Array<Promise>`

A function to update the response from `load`. **It must return a promise.** Think of `update` like a secondary `load`, which has a different way of fetching/loading data.

**IMPORTANT NOTE ON `update`**: It is recommended that your update function resolves with the same response schema as your loading function (load) to avoid erroneous & confusing behaviour in your UI.

Read more on the `update` function [here](#updating-resources).

### `loader`

##### response

> `any`

Response from the resolved promise (`load`).

##### error

> `any`

Error from the rejected promise (`load`).

##### load

> `function(...args, { setResponse, setError })` | returns `Promise`

Trigger to invoke [`load`](#load).

The arguments `setResponse` & `setError` are optional and are used for optimistic responses. [Read more on optimistic responses](#optimistic-responses).

##### update

> `function(...args, { setResponse, setError })` or `Array<function(...args, { setResponse, setError })>`

Trigger to invoke [`update`(#update)]

##### isIdle

> `boolean`

Returns `true` if the state is idle (`load` has not been triggered).

##### isPending

> `boolean`

Returns `true` if the state is pending (`load` is in a pending state).

##### isTimeout

> `boolean`

Returns `true` if the state is timeout (`load` is in a pending state for longer than `delay` milliseconds).

##### isResolved

> `boolean`

Returns `true` if the state is resolved (`load` has been resolved).

##### isRejected

> `boolean`

Returns `true` if the state is rejected (`load` has been rejected).

##### Idle

> `ReactComponent`

Renders it's children when the state is idle.

[See here for an example](#usage-with-state-components)

##### Pending

> `ReactComponent`

Renders it's children when the state is pending.

[See here for an example](#usage-with-state-components)

##### Timeout

> `ReactComponent`

Renders it's children when the state is timeout.

[See here for an example](#usage-with-state-components)

##### Resolved

> `ReactComponent`

Renders it's children when the state is resolved.

[See here for an example](#usage-with-state-components)

##### Rejected

> `ReactComponent`

Renders it's children when the state is rejected.

[See here for an example](#usage-with-state-components)

##### isCached

> `boolean`

Returns `true` if data exists in the cache.

### `<Loads>` Props

The `<Loads>` props mimics the `useLoads` arguments and it's config attributes.

### load

[See here](#load)

### inputs

You can optionally pass an array of `inputs` (or an empty array), which `<Loads>` will use to determine whether or not to load the loading function. If any of the values in the `inputs` array change, then it will reload the loading function.

### defer

[See here](#defer)

### delay

[See here](#delay)

### context

[See here](#context)

### timeout

[See here](#timeout)

### loadPolicy

[See here](#loadpolicy)

### enableBackgroundStates

[See here](#enablebackgroundstates)

### cacheProvider

[See here](#cacheprovider)

### update

[See here](#update)

## `<Loads>` Render Props

The `<Loads>` render props mimics the [`useLoads`' `loader`](#loader).

> Note: `<Loads.Idle>`, `<Loads.Pending>`, `<Loads.Timeout>`, `<Loads.Resolved>` and `<Loads.Rejected>` share the same render props as `<Loads>`.

### response

[See here](#response)

### error

[See here](#error)

### load

[See here](#load-1)

### update

[See here](#update-1)

### isIdle

[See here](#isidle)

### isPending

[See here](#ispending)

### isTimeout

[See here](#istimeout)

### isResolved

[See here](#isresolved)

### isRejected

[See here](#isrejected)

### Idle

[See here](#idle)

### Pending

[See here](#pending)

### Timeout

[See here](#timeout)

### Resolved

[See here](#resolved)

### Rejected

[See here](#rejected)

### isCached

[See here](#iscached)

## `resource = createResource(options)`

> returns an object [`resource`](#resource)

### options

#### _namespace

> string

The namespace of the resource. Mostly used to namespace the cache.

#### load

> `function(...args, { cachedRecord, setResponse, setError })` | returns `Promise`

The function to invoke. **It must return a promise.**

The argument `cachedRecord` is the stored record in the cache (if exists). It uses the [`context` option](#context) to retrieve the cache record.

The arguments `setResponse` & `setError` are optional and are used for optimistic responses. [Read more on optimistic responses](#optimistic-responses).

#### any key is a loading function!

Any key you provide to the resource is a loading function, see the example below.

```jsx
const dogsResource = createResource({
  _namespace: 'dogs',
  load: getDogs,
  create: createDog,
  foo: getDogFoo,
  bar: getDogBar,
  baz: getDogBaz
});

// In your function component:
dogsResource.bar.useLoads();
```

### `resource`

> Object

The resource. Inside are the [`useLoads` hooks](#loader--useloadsload-config-inputs) (and unstable concurrent React features):

```js
{
  useLoads,
  <custom-type>: { useLoads },

  // You must be running experimental React to use these functions.
  unstable_load,
  unstable_preload
}
```

## `cache = useLoadsCache(context)`

> returns [an object (`cache`)](#cache)

### context

> string

The context key of the record to retrieve from cache.

### `cache`

> Object

The cached record.

### Example

```jsx
export default function DogApp() {
  const dogRecord = useLoadsCache('dog');
  // dogRecord = { response: { ... }, error: undefined, isIdle: false, isPending: false, isResolved, true, ... }

  // ...
}
```


# Articles

- [Introducing React Loads — A headless React component to handle promise states and response data](https://medium.freecodecamp.org/introducing-react-loads-a-headless-react-component-to-handle-promise-states-and-response-data-f45cb3621335)
- [Using React Loads and caching for a simple, snappy loading UX](https://medium.com/localz-engineering/using-react-loads-and-caching-for-a-simple-snappy-loading-ux-a91506cce5d1)

# Happy customers

- "I'm super excited about this package" - [Michele Bertoli](https://twitter.com/MicheleBertoli)
- "Love the API! And that nested ternary-boolean example is a perfect example of how messy React code commonly gets without structuring a state machine." - [David K. Piano](https://twitter.com/DavidKPiano)
- "Using case statements with React components is comparable to getting punched directly in your eyeball by a giraffe. This is a huge step up." - [Will Hackett](https://twitter.com/willhackett)
- "I used to get the shakes coding data fetch routines with React. Not anymore. Using react loads, I now achieve data fetching zen." - [Claudia Nadalin](https://github.com/thepenskefile)
- "After seeing https://twitter.com/dan_abramov/status/1039584557702553601?lang=en, we knew we had to change our loading lifecycles; React Loads was our saviour." - [Zhe Wang](https://twitter.com/auzwang)

# License

MIT © [jxom](http://jxom.io)
