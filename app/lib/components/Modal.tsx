'use client';

import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { IconCloseR } from '../SVGs';
import { ModalType } from '@/app/types';

type Props = {
  children: ReactNode;
} & ModalType;

export default function Modal({
  isOpen,
  close,
  children,
  panelClasses,
}: Props) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={close}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/25' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className={classNames(
                    'w-full transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all',
                    panelClasses
                  )}
                >
                  <button
                    onClick={close}
                    type='button'
                    className='absolute right-0 top-0 m-6 hover:text-zinc-600'
                  >
                    <IconCloseR height={24} width={24} />
                  </button>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
