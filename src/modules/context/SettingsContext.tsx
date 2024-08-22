import { FC, ReactElement, createContext, useContext } from 'react';

import { ChatSettingsType, ExchangesSettingsType } from '@/config/appSettings';
import AgentType from '@/types/AgentType';

import { hooks, mutations } from '../../config/queryClient';
import Loader from '../common/Loader';

// mapping between Setting names and their data type
// eslint-disable-next-line @typescript-eslint/ban-types
type AllSettingsType = {
  chat: ChatSettingsType;
  exchanges: ExchangesSettingsType;
};

// default values for the data property of settings by name
const defaultSettingsValues: AllSettingsType = {
  chat: {
    description: '',
    participant_instructions: '',
    participant_end_txt: '',
  },
  exchanges: {
    exchanges_list: [
      {
        assistant: {
          id: '1',
          name: 'Interviewer',
          description: 'Assistant Description',
          type: AgentType.Assistant,
        },
        description: '',
        chatbot_instructions: '',
        participant_cue: '',
        nb_follow_up_questions: NaN,
        hard_limit: false,
      },
    ],
  },
};

// list of the settings names
const ALL_SETTING_NAMES = [
  // name of your settings
  'chat',
  'exchanges',
] as const;

// automatically generated types
type AllSettingsNameType = (typeof ALL_SETTING_NAMES)[number];
type AllSettingsDataType = AllSettingsType[keyof AllSettingsType];

export type SettingsContextType = AllSettingsType & {
  saveSettings: (
    name: AllSettingsNameType,
    newValue: AllSettingsDataType,
  ) => void;
};

const defaultContextValue = {
  ...defaultSettingsValues,
  saveSettings: () => null,
};

const SettingsContext = createContext<SettingsContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const SettingsProvider: FC<Prop> = ({ children }) => {
  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();
  const {
    data: appSettingsList,
    isLoading,
    isSuccess,
  } = hooks.useAppSettings();

  const saveSettings = (
    name: AllSettingsNameType,
    newValue: AllSettingsDataType,
  ): void => {
    if (appSettingsList) {
      const previousSetting = appSettingsList.find((s) => s.name === name);
      // setting does not exist
      if (!previousSetting) {
        postAppSetting({
          data: newValue,
          name,
        });
      } else {
        patchAppSetting({
          id: previousSetting.id,
          data: newValue,
        });
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const getContextValue = (): SettingsContextType => {
    if (isSuccess) {
      const allSettings: AllSettingsType = ALL_SETTING_NAMES.reduce(
        <T extends AllSettingsNameType>(acc: AllSettingsType, key: T) => {
          // todo: types are not inferred correctly here
          // @ts-ignore
          const setting = appSettingsList.find((s) => s.name === key);
          if (setting) {
            const settingData =
              setting?.data as unknown as AllSettingsType[typeof key];
            acc[key] = settingData;
          } else {
            acc[key] = defaultSettingsValues[key];
          }
          return acc;
        },
        defaultSettingsValues,
      );
      return {
        ...allSettings,
        saveSettings,
      };
    }
    return defaultContextValue;
  };

  const contextValue = getContextValue();

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType =>
  useContext<SettingsContextType>(SettingsContext);
