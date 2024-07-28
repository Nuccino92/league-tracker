'use client';

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Listbox, Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import useDebounce from '@/app/lib/hooks/useDebounce';
import useQueryString from '@/app/lib/hooks/useQueryString';
import {
  DeleteIcon,
  DownChevronIcon,
  EditIcon,
  EmptyListIcon,
  IconBackupRestore,
  IconEllipsisVertical,
  IconListAdd,
  IconOptionsOutline,
  Spinner,
} from '@/app/lib/SVGs';
import SearchBar from '@/app/lib/components/SearchBar';
import { usePlayers } from '@/app/lib/hooks/api/control-panel/players';
import { ControlPanelListPlayer } from '@/app/lib/types/Responses/control-panel.types';
import MissingList from '@/app/control-panel/_components/MissingList';
import { useControlPanelTeamsForDropdown } from '@/app/lib/hooks/api/control-panel/teams';
import AchivedPlayersModal from './ArchivedPlayersModal';
import DeletePlayerModal from './DeletePlayerModal';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import DropdownMenu from '@/app/lib/components/DropdownMenu';

const menuItemClasses = `hover:bg-secondary hover:text-white w-full p-2 text-start`;

const PlayerForm = dynamic(
  () =>
    import('@/app/control-panel/league/[slug]/players/_components/PlayerForm')
);

export default function Players({ slug }: { slug: string }) {
  const params = useParams();
  const { data, status, isLoading } = usePlayers({
    slug,
    includeOnly: ['season', 'page', 'search', 'team'],
  });

  const [showCreatePlayerModal, setShowCreatePlayerModal] = useState(false);
  const [showArchivedPlayersModal, setShowArchivedPlayersModal] =
    useState(false);
  const [page, setPage] = useState(
    params?.page ? parseInt(params?.page as string) : 1
  );

  const shouldDisplayContent = status === 'success' && data;

  return (
    <main className='h-full space-y-4'>
      <PlayersHeader
        setShowCreatePlayerModal={setShowCreatePlayerModal}
        setShowArchivedPlayersModal={setShowArchivedPlayersModal}
        slug={slug}
      />

      {shouldDisplayContent ? (
        <>
          <div className='h-full max-h-full'>
            <div className='swatches-picker h-[95%] max-h-[95%] space-y-3 overflow-y-auto'>
              {data.length > 0 ? (
                data.map((player) => (
                  <PlayerCard player={player} key={player.id} />
                ))
              ) : (
                <MissingList
                  text='There are no Players'
                  icon={
                    <EmptyListIcon className='w-full' height={55} width={55} />
                  }
                />
              )}
            </div>{' '}
            <div className='w-full py-4 text-center'>paginate the teams</div>
          </div>

          {showCreatePlayerModal ? (
            <PlayerForm
              isOpen={showCreatePlayerModal}
              close={() => setShowCreatePlayerModal(false)}
            />
          ) : null}

          {showArchivedPlayersModal ? (
            <AchivedPlayersModal
              isOpen={showArchivedPlayersModal}
              close={() => setShowArchivedPlayersModal(false)}
            />
          ) : null}
        </>
      ) : null}
      {status === 'loading' ? (
        <div className='flex h-full w-full items-center justify-center py-12'>
          <Spinner width={50} height={50} />
        </div>
      ) : null}
    </main>
  );
}

function PlayersHeader({
  setShowCreatePlayerModal,
  setShowArchivedPlayersModal,
  slug,
}: {
  setShowCreatePlayerModal: Dispatch<SetStateAction<boolean>>;
  setShowArchivedPlayersModal: Dispatch<SetStateAction<boolean>>;
  slug: string;
}) {
  const { leagueData } = useLeagueControlPanel();
  const { seasons } = leagueData;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { teamsDropdownList, status } = useControlPanelTeamsForDropdown({
    slug,
  });

  const selectedSeason = searchParams.get('season')
    ? parseInt(searchParams.get('season') as string)
    : null;

  const selectedTeam = searchParams.get('team')
    ? parseInt(searchParams.get('team') as string)
    : null;

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get('search') ?? ''
  );
  const debouncedSearch = useDebounce(searchInputValue, 750);

  const { createQueryString } = useQueryString();

  useEffect(() => {
    router.push(pathname + '?' + createQueryString('search', debouncedSearch));
  }, [createQueryString, debouncedSearch, pathname, router]);

  const hasFinishedFetching = status === 'success' && teamsDropdownList;

  const pageOptions = [
    {
      label: 'Create Player',
      action: () => setShowCreatePlayerModal(true),
      icon: <IconListAdd height={20} width={20} />,
    },
    {
      label: 'Archived Players',
      action: () => setShowArchivedPlayersModal(true),
      icon: <IconBackupRestore height={20} width={20} />,
    },
  ];

  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <PageHeader text='League Players' />
        <DropdownMenu
          items={pageOptions}
          itemClasses='p-2'
          buttonIcon={(open) => (
            <IconOptionsOutline
              height={24}
              width={24}
              color={open ? 'white' : 'currentColor'}
            />
          )}
        />
      </div>
      <div className='flex items-center space-x-6'>
        <span className='-mr-2 text-sm font-medium italic'>Filters:</span>
        {/* Season dropdown */}
        <Listbox
          as={'div'}
          className={'relative min-w-[200px]'}
          value={selectedSeason}
          onChange={(value) =>
            router.push(
              pathname + '?' + createQueryString('season', value?.toString())
            )
          }
        >
          <Listbox.Button
            type='button'
            className={
              'flex w-full items-center justify-between space-x-2 rounded bg-white p-2 text-sm font-medium shadow-sm'
            }
          >
            <span>
              {seasons.all_seasons.find(
                (season) => season.id === selectedSeason
              )?.name ?? 'All Seasons'}
            </span>
            <DownChevronIcon height={22} width={22} />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options
              as='ul'
              className='absolute z-10 mt-1 w-max min-w-full overflow-auto rounded-md border border-violet-100 bg-white text-sm font-medium shadow-sm'
            >
              <Listbox.Option
                as='li'
                key={'all teams no season'}
                value={null}
                className={classNames(
                  selectedSeason === null ? 'bg-primary text-white' : '',
                  'flex cursor-pointer items-center space-x-2 px-2 py-2 hover:bg-secondary hover:text-white'
                )}
              >
                All Seasons
              </Listbox.Option>
              {seasons.all_seasons.map((season) => (
                <Listbox.Option
                  as='li'
                  key={season.id + season.name}
                  value={season.id}
                  className={classNames(
                    selectedSeason === season.id ? 'bg-primary text-white' : '',
                    'flex cursor-pointer items-center space-x-2 px-2 py-2 hover:bg-secondary hover:text-white'
                  )}
                >
                  <span>{season.name}</span>{' '}
                  {season.id === seasons.active_season_id ? (
                    <span>(current)</span>
                  ) : null}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>

        {/* Team dropdown */}
        <Listbox
          as={'div'}
          className={'relative min-w-[200px]'}
          value={selectedTeam}
          onChange={(value) =>
            router.push(
              pathname + '?' + createQueryString('team', value?.toString())
            )
          }
        >
          <Listbox.Button
            type='button'
            className={
              'flex w-full items-center justify-between space-x-2 rounded bg-white p-2 text-sm font-medium shadow-sm'
            }
          >
            <span>
              {teamsDropdownList?.find((team) => team.id === selectedTeam)
                ?.name ?? 'All Teams'}
            </span>
            <DownChevronIcon height={22} width={22} />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options
              as='ul'
              className='absolute z-10 mt-1 w-max min-w-full overflow-auto rounded-md border border-violet-100 bg-white text-sm font-medium shadow-sm'
            >
              {hasFinishedFetching ? (
                <>
                  <Listbox.Option
                    as='li'
                    key={'all teams no season'}
                    value={null}
                    className={classNames(
                      selectedTeam === null ? 'bg-primary text-white' : '',
                      'flex cursor-pointer items-center space-x-2 px-2 py-2 hover:bg-secondary hover:text-white'
                    )}
                  >
                    All Teams
                  </Listbox.Option>
                  {teamsDropdownList?.map((team) => (
                    <Listbox.Option
                      as='li'
                      key={team.id + team.name}
                      value={team.id}
                      className={classNames(
                        selectedTeam === team.id ? 'bg-primary text-white' : '',
                        'flex cursor-pointer items-center space-x-2 px-2 py-2 hover:bg-secondary hover:text-white'
                      )}
                    >
                      <span>{team.name}</span>{' '}
                    </Listbox.Option>
                  ))}
                </>
              ) : null}

              {status === 'loading' ? (
                <div className='flex items-center justify-center py-4'>
                  <Spinner height={14} width={14} />
                </div>
              ) : null}
            </Listbox.Options>
          </Transition>
        </Listbox>

        <SearchBar
          inputValue={searchInputValue}
          setInputValue={setSearchInputValue}
          placeholder='Search for a player...'
          searchIconSize={22}
          closeIconSize={20}
        />
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: ControlPanelListPlayer }) {
  const [showPlayerEditModal, setShowPlayerEditModal] = useState(false);
  const [showPlayerDeleteModal, setShowPlayerDeleteModal] = useState(false);

  const dropdownOption = [
    {
      label: 'Edit',
      action: () => setShowPlayerEditModal(true),
      icon: <EditIcon width={20} height={20} />,
    },
    {
      label: 'Delete',
      action: () => setShowPlayerDeleteModal(true),
      icon: <DeleteIcon width={20} height={20} />,
    },
  ];

  return (
    <>
      <div className='flex w-full items-center justify-between rounded bg-white p-4'>
        <div
          className='flex items-center space-x-2 transition-colors duration-100 ease-out hover:text-secondary'
          role='button'
          tabIndex={0}
          onClick={() => setShowPlayerEditModal(true)}
        >
          {player.avatar ? (
            <div className='relative h-12 w-12 rounded border'>
              <Image
                src={player.avatar}
                alt={`${player.avatar} logo`}
                fill
                style={{ objectFit: 'contain', position: 'absolute' }}
                sizes='(max-width: 50px) 100vw'
              />
            </div>
          ) : (
            <div className='flex h-12 w-12 items-center justify-center rounded border bg-primary text-sm font-medium text-white'>
              N/A
            </div>
          )}
          <div className='flex flex-col'>
            <span className='text-lg font-medium'>{player.name}</span>
            <span className='text-sm italic text-zinc-900'>
              <span className='font-medium'>Team:</span>{' '}
              <span
                className={classNames(
                  player.team ? 'font-bold' : 'text-gray-400 '
                )}
              >
                {player.team ? player.team : 'None'}
              </span>
            </span>
          </div>
        </div>

        <DropdownMenu
          items={dropdownOption}
          buttonIcon={(open) => (
            <IconEllipsisVertical color={open ? 'white' : 'currentColor'} />
          )}
          itemContainerClasses='!left-[-11rem]'
          itemClasses={`${menuItemClasses}`}
        />
      </div>

      {showPlayerEditModal ? (
        <PlayerForm
          isOpen={showPlayerEditModal}
          close={() => setShowPlayerEditModal(false)}
          playerId={player.id}
        />
      ) : null}

      {showPlayerDeleteModal ? (
        <DeletePlayerModal
          isOpen={showPlayerDeleteModal}
          close={() => setShowPlayerDeleteModal(false)}
          playerId={player.id}
        />
      ) : null}
    </>
  );
}
