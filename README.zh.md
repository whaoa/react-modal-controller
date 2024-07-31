<h1 align="center">React Modal Manager</h1>

<p align="center">
  <strong>A lightweight modal manager for React.</strong>
</p>

<p align="center">
  允许你在 React 应用中以命令式的方式来轻松的管理 Modal。
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

## 背景

在 React 中使用 Modal 通常会让人觉得有些疲惫，想象一下页面中有个按钮，我们需要在按钮被点击后打开一个 Modal。

通常情况下，我们需要按这样的步骤来实现：

1. 首先创建一个 Modal 组件
2. 然后创建一个用来控制 Modal 显示的状态，并将它传递给 Modal
3. 最后，通过修改这个状态来控制 Modal 的显示

当页面中有很多 Modal 时，我们需要维护大量的状态来控制 Modal 的显示。
更糟糕的是，也许最初之需要在某个按钮被点击后打开一个 Modal 就足够了，但随着需求的变化，你可能需要在不同的地方打开同一个的 Modal。
在这个时候，你不得不需要重新考虑应该在哪里对状态和组件进行声明。

为了避免这些让人痛苦的情况，我创建了这个项目来尝试解决这些问题，希望它同样可以帮助到你。

注意：这个项目不是一个 React 的 Modal 组件，它只提供了一个用来管理 Modal 的 API。
你需要配合其他的 Modal 组件来一起使用（比如 Material UI, Ant Design 这类 UI 组件库提供的 Modal / Dialog 组件）

## 特性

- **足够轻量** ：没有外部依赖以及很小的 Bundle Size
- **非受控** ：允许你在任何地方对 Modal 进行管理，甚至是在 React 外部
- **Promise API** ：可以通过 Promise 方式来与 Modal 外部进行交互
- **数据绑定** : 可以容易的传递 React 内的状态到 Modal 中，并保持状态的更新
- **平台无关**: 没有平台相关绑定，理论上可以用于任何 React 环境中
- **UI 无关**: 可以很容易的与其他 UI 组件库进行集成

## 安装

```sh
# with npm
npm install @whaoa/react-modal-manager

# or with pnpm
pnpm add @whaoa/react-modal-manager

# or with yarn
yarn add @whaoa/react-modal-manager
```

## 创建 ModalManager 和 Modal

首先，你需要使用 `createModalManager` 来创建一个 ModalManager 实例，后续的所有管理操作都需要通过 ModalManager 来实现。
你也可以根据自己的需要来创建多个实例，每个实例都是独立的。

然后，你需要使用 `createModal` 来包装你的 Modal 组件，它接收一个组件，在这个组件中可以通过 `useModal` 来访问 Modal 的相关状态。

```tsx
// @filename: './modal.tsx'
import { createModal, createModalManager } from '@whaoa/react-modal-manager';
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

## 使用 Modal

在使用 ModalManager 之前，你需要确保 `ModalStackPlacement` 已经正确渲染了。

`ModalStackPlacement` 适用于渲染 Modal 的组件，通过 ModalManager 打开的 Modal 最终是由这个组件渲染的。

我推荐你将这个组件放在你应用的最上层，当然你也可以将它放到任何位置上，
需要注意的是每个 ModalManager 应该同时只有一个 `ModalStackPlacement` 组件被渲染。
否则每个 `ModalStackPlacement` 都会渲染对应的 ModalManager 中的 Modal，导致同一个 Modal 会同时渲染多个。

之后，你可以通过调用 `ModalManager.open` 来打开一个新的 Modal 了。
这个 `open` 函数接收两个参数，第一个参数是通过 `createModal` 包装的 Modal 组件，第二个参数是需要传递给 Modal 的 props。

提示：你可以在任何位置调用 `ModalManager.open`，包括 React 外部。

```tsx
import { ModalStackPlacement } from '@whaoa/react-modal-manager';

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

## 使用 Promise API

除了将 onClose 这类的函数作为 props 传递给 Modal 外，
还可以通过 `ModalManager.open` 返回的 Modal 实例上的 Promise 来对 Modal 的 close 事件进行处理。

你可以通过一下方式来 关闭 或 移除 一个 Modal：

- 在 Modal 内通过 `useModal` 返回的 `.close` 和 `.remove` 方法。
- 在 Modal 外部通过 `ModalManager.open` 返回的 Modal 实例的 `.close` 和 `.remove` 方法。
- 通过 ModalManager 的 `.close` 和 `.remove` 方法（需要传递 `ModalManager.open` 返回的 Modal 实例的 id）。

当调用 `close` 和 `remove` 时，你可以传递一个参数作为 payload，
这个参数将在 Modal 实例的 Promise.then 中作为参数传递，可以通过 `result.payload` 来进行访问，
本次关闭方式可以通过 `result.type` 进行区分（`close` 和 `remove`）。

`ModalManager.open` 会返回一个 Modal 实例，其中 `promise` 属性是一个表示 Modal 是否关闭的 Promise 实例，
当 Modal 被关闭时这个 Promise 将会被标记为 resolved。

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

注意：由于 Promise 的状态只可以被标记一次，所以一个 Modal 打开后，只有第一次调用的 `close` / `remove` 是有效的。
这意味着在先调用 `close` 再调用 `remove` 的情况下，`remove` 的调用并不会导致 Promise 的状态发生变化。

## 传递 React State 给 Modal

有时你可能需要将一个会发生变化的 React 状态传递给 Modal，但是 `ModalManager.open` 并不能实现这个效果，
你需要使用 `ModalController` 来实现。

`ModalController` 是一个 React 组件，它接收一个由 `createModal` 创建的 Modal 作为 prop，
并将接收到的其他 props 透传给 Modal 组件。

由 `ModalController` 渲染的 Modal 将通过内部的 ModalManager 来进行控制，
Modal 将会被直接渲染到 `ModalController` 所在位置，而不经过 `ModalStackPlacement`。
这类方式渲染的 Modal 可以通过 `ModalController` 的 `ref` 来进行控制。

```tsx
import { useEffect, useRef, useState } from 'react';
import { ModalController } from '@whaoa/react-modal-manager';

import { Modal } from './modal';

import type { ModalControllerRef } from '@whaoa/react-modal-manager';

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

注意：由于渲染方式不同，`ref` 中并不提供 `remove` 方法。`useModal.remove` 将会回退到 `close` 方法。

## License

MIT © [React Modal Manager](https://github.com/whaoa/react-modal-manager)
