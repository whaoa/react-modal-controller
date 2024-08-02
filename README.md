<h1 align="center">React Modal Manager</h1>

<p align="center">
  <strong>A lightweight modal manager for React.</strong>
</p>

<p align="center">
  It allows you to easily manage modals in your react app in a imperative way.
</p>

<p align="center">
  <a href="https://github.com/whaoa/react-modal-manager/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/whaoa/react-modal-manager?style=flat&label=license">
  </a>
  <a href="https://github.com/whaoa/react-modal-manager/releases">
    <img alt="Version" src="https://img.shields.io/github/package-json/v/whaoa/react-modal-manager/main?style=flat&label=version">
  </a>
</p>

<p align="center">
  <a href="./README.md">English</a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="./README.zh.md">中文</a>
</div>

## Motivation

Using modals in React is often a bit exhausting.
Imagine there's a button in the view and we need to open a modal when the button is clicked.

Typically, we need to do something like this:

1. first create a modal component.
2. then create a state that controls the display of the modal where the modal is used and pass it to the modal.
3. finally, open the modal by updating this state.

When there are a lot of modals in a view, we need to manage a lot of state to control the modals.

Even worse, it may be enough to open a modal when a button is clicked,
but as requirements change and you need to open the same modal from different places,
you have to rethink where the modal and corresponding state should be declared.

To avoid these agonizing situations, I created this library to try to solve these problems,
and I hope it will help you too.

Note: This library is not a React modal component, it just provides the API for modal management,
so you should use it with other modal components (Modal / Dialog provided by UI libraries like Material UI, Ant Design, etc).

## Features

- **Lightweight**: Zero dependency and small
- **Uncontrolled**: Manage modals from anywhere, even outside of React
- **Promise API**: Can use Promise to interact with the outside of the modal
- **Props Binding**: Easy to pass props and keep state up-to-date.
- **Platform Agnostic**: No platform binding, can be used in any React environment in theory
- **UI Agnostic**: Easy to integrate with other UI libraries

## Installation

```sh
# with npm
npm install @whaoa-libs/react-modal-manager

# or with pnpm
pnpm add @whaoa-libs/react-modal-manager

# or with yarn
yarn add @whaoa-libs/react-modal-manager
```

## Create ModalManager And Modal Component

First, you need to create a ModalManager instance through `createModalManager`,
and all management operations will be handled through this instance.
You can also create as many instances as you want, each instance is independent.

Then, you need to wrap your modal component with `createModal`,
it accepts a component that can read the current modal's state and API via `useModal`.

```tsx
// @filename: './modal.tsx'
import { createModal, createModalManager } from '@whaoa-libs/react-modal-manager';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// create modal manager
// eslint-disable-next-line react-refresh/only-export-components
export const mm = createModalManager();

// wrapper your modal component with createModal
export const Modal = createModal((props: { content?: string }) => {
  const { content } = props;
  const state = useModal();

  return (
    <Dialog open={state.visible} onClose={state.close}>
      <DialogTitle>MUI Dialog</DialogTitle>
      <DialogContent dividers>
        {content || 'default modal content'}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={state.close}>Close</Button>
      </DialogActions>
    </Dialog>
  );
});
```

## Use Your Modal Component

Before using the ModalManager, you need to make sure that the `ModalStackPlacement` is rendered.

`ModalStackPlacement` is used to render modal components,
the modal opened by ModalManager will be eventually rendered by `ModalStackPlacement`.

I recommend that you place it at the top of your application, you can also render it anywhere else,
but make sure that only one `ModalStackPlacement` component is rendered for the same ModalManager,
otherwise multiple modals may be rendered at the same time!

Then, you can open a modal via `ModalManager.open`. The `open` method takes two arguments,
the first is the modal component wrapped by `createModal`,
and the second (optional) is the props passed to the component.

PS: You can call `ModalManager.open` from anywhere, including outside of React.

```tsx
import { ModalStackPlacement } from '@whaoa-libs/react-modal-manager';

import { Modal, mm } from './modal';

function App() {
  return (
    <button type="button" onClick={() => mm.open(Modal, { content: 'modal content' })}>
      open modal
    </button>
  );
}

export function Root() {
  return (
    <div>
      <App />
      <ModalStackPlacement modalManager={mm} />
    </div>
  );
};
```

## Using Promise API

In addition to passing functions like onClose to the modal as props,
you can also handle modal close events with a Promise via the return value of `ModalManager.open`.

You can close or remove a modal in these ways:

- inside a modal via the `close` and `remove` methods returned by `useModal`.
- outside the modal via the `close` and `remove` methods on the modal instance returned by `ModalManager.open`.
- via the `close` and `remove` methods on the `ModalManager` (need to pass the id on the modal instance returned by `ModalManager.open`).

When calling `close` and `remove`, you can pass an argument as a payload,
which can be accessed in the then callback of the modal's Promise instance via `result.payload`,
and you can distinguish between `close` and `remove` via `result.type`.

The `ModalManager.open` method returns a modal instance
with a `promise` property that is a Promise instance indicating when the modal is closed,
when the modal is closed or removed, the Promise is marked as resolved.

```tsx
import { Modal, mm } from './modal';

const modal = mm.open(Modal);

modal.promise.then((result) => {
  switch (result.type) {
    case 'close':
      // payload of close event
      console.log(result.payload);
      break;
    case 'remove':
      // payload of remove event
      console.log(result.payload);
      break;
  }
});
```

Note: Since the state of a Promise can be marked only once,
only the first call to `close` or `remove` will change the state of the Promise for the modal after it is opened.
This means that if `close` is called first and then `remove` is called,
then `remove` will not change the Promise.

## Pass React State as Props to Modal Component

Sometimes you need to pass state that changes in React to a modal,
but `ModalManager.open` can't do that, so you need to use the `ModalController` component to do it.

`ModalController` is a React component that accepts a modal created by `createModal` as a prop
and passes any other props it receives to the modal component.

The modal rendered by `ModalController` component is controlled by the internal ModalManager,
and can be opened and closed via the component's ref.

```tsx
import { useEffect, useRef, useState } from 'react';
import { ModalController } from '@whaoa-libs/react-modal-manager';

import { Modal } from './modal';

import type { ModalControllerRef } from '@whaoa-libs/react-modal-manager';

export function App() {
  const modalRef = useRef<ModalControllerRef<{ content?: string }>>();

  const [datetime, setDatetime] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => setDatetime(new Date().toUTCString()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <button type="button" onClick={() => modalRef.current?.open()}>open modal</button>
      <ModalController ref={modalRef} modal={Modal} content={datetime} />
    </div>
  );
}
```

Note: Because of the different rendering mode, the ref does not provide a `remove` method.
`useModal.remove` will fallback to the `close` method.

## License

MIT © [React Modal Manager](https://github.com/whaoa/react-modal-manager)
