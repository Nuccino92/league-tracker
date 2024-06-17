'use client';

import { ChangeEvent, useRef, useState } from 'react';

/**
 * @TODO out from profile
 */

type Props = {
  name: string;
  view: 'control-panel' | 'profile';
  maxFileSize?: number;
  changeEvent: (value: string) => void;
  errorEvent?: (message: string) => void;
};

export default function FileUpload({
  name,
  view,
  maxFileSize = 1024 * 1024,
  changeEvent,
  errorEvent,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    acceptedTypes: string[]
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      if (errorEvent) {
        return errorEvent(
          `Invalid file type, Please select from a ${acceptedTypes.join(', ')}`
        );
      } else {
        return alert(
          `Invalid file type, Please select from a ${acceptedTypes.join(', ')}`
        );
      }
    }

    if (maxFileSize && file.size > maxFileSize) {
      alert('File is too large.');
      return;
    }

    // Simulated upload process
    try {
      setIsUploading(true);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1500);
      });

      setIsUploading(false);

      changeEvent(
        'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png'
      );
    } catch (error) {
      setIsUploading(false);
      console.error('Upload process failed:', error);
    }
  };

  return (
    <>
      {view === 'control-panel' ? (
        <label
          tabIndex={1}
          htmlFor={name}
          className='relative h-[200px] w-full cursor-pointer rounded-md border border-dashed border-slate-200 bg-white focus:outline-secondary'
          draggable={true}
          onKeyDown={(e) => {
            if (isUploading) return;
            if (e.key === 'Enter') {
              fileRef.current?.click();
            }
          }}
          onClick={() => {
            if (isUploading) return;
            if (errorEvent) {
              errorEvent('');
            }

            fileRef.current?.click();
          }}
        >
          <div className='flex h-full w-full flex-col items-center justify-center space-y-1 text-sm transition-all duration-75 hover:bg-gray-50 hover:opacity-80'>
            {isUploading ? (
              <div role='status'>
                <svg
                  aria-hidden='true'
                  className='inline h-8 w-8 animate-spin fill-secondary text-gray-200 dark:text-gray-600'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                  />
                </svg>
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              <>
                {' '}
                <span className='font-medium'>CLICK TO UPLOAD IMAGE</span>
                <div className='flex flex-col items-center'>
                  <span className='text-xs'>Maximum size allowed: (500KB)</span>
                  <span className='text-xs'>
                    Accepted File types: (jpg, jpeg, png)
                  </span>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            onChange={(e) =>
              handleFileUpload(e, ['image/jpg', 'image/jpeg', 'image/png'])
            }
            className='hidden'
            type='file'
            accept='image/jpg image/jpeg image/png'
          />
        </label>
      ) : null}
    </>
  );
}

('https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png');
