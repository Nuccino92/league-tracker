'use client';
import { useState } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { Form, Formik, FastField, ErrorMessage, FormikValues } from 'formik';
import { toFormikValidate } from 'zod-formik-adapter';
import classNames from 'classnames';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { usePlayer } from '@/app/lib/hooks/api/control-panel/players';
import { Player } from '@/app/lib/types/Models/Player';
import { ModalType } from '@/app/types';
import Modal from '@/app/lib/components/Modal';
import {
  PlayerInformationResource,
  playerInformationSchema,
} from '@/app/lib/types/Resources/CreatePlayerResource';
import {
  inputClasses,
  inputContainerClasses,
  skeletonClass,
} from '@/app/lib/globals/styles';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import { DeleteIcon, DownChevronIcon } from '@/app/lib/SVGs';
import Checkbox from '@/app/lib/components/Checkbox';
import FileUpload from '@/app/lib/components/FileUpload';
import { Button } from '@/app/lib/components/Button';

export default function PlayerForm({
  isOpen,
  close,
  playerId,
}: ModalType & { playerId?: number }) {
  const { leagueData } = useLeagueControlPanel();
  const { player, status } = usePlayer({
    slug: leagueData.league_info.slug,
    playerId: playerId,
  });

  const [isShowAdditionalOptionsChecked, setIsShowAdditionalOptionsChecked] =
    useState(localStorage.getItem('showExtraTeamOptions') ? true : false);

  const [shouldShowAdditionalOptions, setShouldShowAdditionalOptions] =
    useState(isShowAdditionalOptionsChecked);

  const originalNameForHeaderTag = player ? player.name : '';

  /**
   * @todo
   * fetch data instead of pass in a prop, going to have additional values like age/number
   */

  function handleSubmit(values: FormikValues) {
    /*
     *  TODO: need to check if there is an id present to either save/update.
     *  can either use same hook/endpoint or make 2 seperate
     */

    const valuesToSave = {
      ...values,
      number: values.number === '' ? null : values.number,
      age: values.age === '' ? null : values.age,
    } as PlayerInformationResource;

    console.log('valuesToSave', valuesToSave);
  }

  function handleShowAdditionalOptionsClick() {
    if (isShowAdditionalOptionsChecked) {
      localStorage.removeItem('showExtraTeamOptions');
      setIsShowAdditionalOptionsChecked(false);
    } else {
      localStorage.setItem('showExtraTeamOptions', 'true');
      setIsShowAdditionalOptionsChecked(true);
    }
  }

  return (
    <Modal panelClasses='sm:w-[640px] w-full' isOpen={isOpen} close={close}>
      <div className=''>
        {status === 'success' && player ? (
          <Formik
            onSubmit={handleSubmit}
            initialValues={{
              ...player,
              age: player.age ?? '',
              number: player.number ?? '',
            }}
            validate={toFormikValidate(playerInformationSchema)}
          >
            {(props) => (
              <Form className='space-y-4'>
                <h4 className='text-2xl font-bold'>
                  {props.values.id
                    ? `${originalNameForHeaderTag}`
                    : 'Create new player'}
                </h4>

                <div className={inputContainerClasses}>
                  <FormLabel label='Name' htmlFor='name' required />
                  <FastField
                    className={inputClasses}
                    name='name'
                    placeholder='Enter name here...'
                  />
                  <ErrorMessage
                    component={'span'}
                    className='text-sm text-red-500'
                    name='name'
                  />
                </div>

                <div className='!mb-0 !mt-6 flex items-center justify-between'>
                  <button
                    type='button'
                    className='flex items-center space-x-1 text-sm font-bold hover:text-zinc-600'
                    onClick={() =>
                      setShouldShowAdditionalOptions((prev) => !prev)
                    }
                  >
                    <span className='text-sm'>
                      {shouldShowAdditionalOptions ? 'Hide ' : 'Show extra '}{' '}
                      options
                    </span>
                    <DownChevronIcon height={17} width={17} strokeWidth={2} />
                  </button>

                  <div className='flex items-center space-x-2 text-xs'>
                    <span> Always show extra options?</span>
                    <Checkbox
                      isChecked={isShowAdditionalOptionsChecked}
                      onClick={() => handleShowAdditionalOptionsClick()}
                    />
                  </div>
                </div>

                {shouldShowAdditionalOptions ? (
                  <div className='space-y-4'>
                    <div className={inputContainerClasses}>
                      <FormLabel label='Player Image' htmlFor='logo' />
                      <div className='flex h-[200px] items-center justify-center space-x-2'>
                        {props.values.avatar ? (
                          <div className='relative h-[200px] w-full  rounded-md border border-slate-200 bg-white'>
                            <Image
                              src={props.values.avatar}
                              alt='Players avatar'
                              style={{ objectFit: 'contain' }}
                              fill
                            />

                            <button
                              onClick={async () => {
                                /*
                                 * TODO:
                                 * await delete from s3
                                 */

                                props.setFieldValue('avatar', null);
                              }}
                              className='absolute right-0 m-2 transition-colors hover:text-red-500'
                              type='button'
                            >
                              <DeleteIcon width={24} height={24} />
                            </button>
                          </div>
                        ) : (
                          <FileUpload
                            name='logo'
                            view='control-panel'
                            maxFileSize={500 * 1024}
                            changeEvent={(value) =>
                              props.setFieldValue('avatar', value)
                            }
                            errorEvent={(message) =>
                              props.setFieldError('avatar', message)
                            }
                          />
                        )}
                      </div>

                      {props.errors.avatar ? (
                        <span className='text-sm text-red-500'>
                          {props.errors.avatar}
                        </span>
                      ) : null}
                    </div>

                    <div className='flex flex-col space-y-6 md:flex-row md:space-x-4 md:space-y-0'>
                      <div className={'w-full ' + inputContainerClasses}>
                        <FormLabel label='Jersey Number' htmlFor='number' />
                        <FastField
                          className={inputClasses}
                          name='number'
                          placeholder='Enter number here...'
                          type='number'
                          min={0}
                        />
                        <ErrorMessage
                          component={'span'}
                          className='text-sm text-red-500'
                          name='number'
                        />
                      </div>
                      <div className={'w-full ' + inputContainerClasses}>
                        <FormLabel label='Age' htmlFor='age' />
                        <FastField
                          className={inputClasses}
                          name='age'
                          placeholder='Enter age here...'
                          type='number'
                          min={0}
                        />
                        <ErrorMessage
                          component={'span'}
                          className='text-sm text-red-500'
                          name='age'
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className='flex w-full justify-end'>
                  <Button
                    type='submit'
                    variant={'secondary'}
                    className='self-end'
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : null}

        {status === 'loading' ? (
          <FormSkeleton showExtraOptions={shouldShowAdditionalOptions} />
        ) : null}
      </div>
    </Modal>
  );
}

function FormSkeleton({ showExtraOptions }: { showExtraOptions: boolean }) {
  return (
    <div className='w-full space-y-4'>
      <div className={classNames('h-8 w-1/2', skeletonClass)} />

      <div className={inputContainerClasses}>
        <div className={classNames('h-4 w-14', skeletonClass)} />
        <div className={classNames('h-8', skeletonClass)} />
      </div>

      <div className='flex w-full items-center justify-between'>
        <div className={classNames('h-5 w-14', skeletonClass)} />
        <div className='flex items-center space-x-1'>
          <div className={classNames('h-5 w-[100px]', skeletonClass)} />
          <div className={classNames('h-5 w-5', skeletonClass)} />
        </div>
      </div>

      {showExtraOptions ? (
        <div className='space-y-4'>
          <div className={inputContainerClasses}>
            <div className={classNames('h-4 w-20', skeletonClass)} />
            <div className={classNames('h-[150px]', skeletonClass)} />
          </div>

          <div className='flex flex-col space-y-6 md:flex-row md:space-x-4 md:space-y-0'>
            <div className={'w-full ' + inputContainerClasses}>
              <div className={classNames('h-4 w-14', skeletonClass)} />
              <div className={classNames('h-8 w-full', skeletonClass)} />
            </div>
            <div className={'w-full ' + inputContainerClasses}>
              <div className={classNames('h-4 w-14', skeletonClass)} />
              <div className={classNames('h-8 w-full', skeletonClass)} />
            </div>
          </div>

          <div className='flex w-full justify-end'>
            <div className={classNames('h-10 w-[100px]', skeletonClass)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
