import { useRef, useState } from 'react';
import { ModalController, createModal, useModal } from '@whaoa/react-modal-manager';
import { Button, Modal as Dialog } from 'antd';

import { mm } from './mm';

import type { ModalControllerRef } from '@whaoa/react-modal-manager';

const Modal = createModal((props: { description?: string }) => {
  const { description } = props;
  const { visible, close, remove } = useModal();
  return (
    <Dialog
      title="Antd Modal"
      open={visible}
      okText="Close"
      cancelText="Remove"
      onOk={close}
      onCancel={remove}
      onClose={close}
    >
      <p>
        When requiring users to interact with the application,
        but without jumping to a new page and interrupting the user's workflow,
        you can use Modal to create a new floating layer over the current page
        to get user feedback or display information.
      </p>
      {description ? <p>{description}</p> : null}
    </Dialog>
  );
});

export function AntdControlledModalView() {
  const [datetime, setDatetime] = useState('');

  const modalRef = useRef<ModalControllerRef<{ description?: string }>>(null);

  const handleClick = () => {
    if (modalRef.current) {
      const intervalId = setInterval(() => setDatetime(new Date().toUTCString()), 1000);
      setDatetime(new Date().toUTCString());
      modalRef.current.open().promise.finally(() => {
        clearInterval(intervalId);
      });
    }
  };

  return (
    <>
      <Button style={{ marginRight: 10 }} type="primary" onClick={handleClick}>
        Open Controlled Antd Modal
      </Button>

      <ModalController ref={modalRef} controlledModal={Modal} description={`ant-design controlled modal (at ${datetime})`} />
    </>
  );
}

export function AntdModalView() {
  return (
    <Button
      style={{ marginRight: 10 }}
      type="primary"
      onClick={() => mm.open(Modal, { description: `ant-design modal (at: ${new Date().toUTCString()})` })}
    >
      Open Antd Modal
    </Button>
  );
}
