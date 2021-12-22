# react-native-streaming


This library exposes a cross-platform interface for showing live streaming for host and viewer, providing a unified user and developer experience.

## Setup


You must install list lib we're use in lib
 - [`react-native-reanimated`](https://github.com/kmagiera/react-native-reanimated). (v2.2.4)
 - [`lottie-react-native`](https://github.com/lottie-react-native/lottie-react-native).
 - [`react-native-agora`](https://github.com/AgoraIO-Community/react-native-agora#readme). (>v3)

Install the library using yarn:

```bash
# using yarn
$ yarn add https://github.com/thuanneotime/react-native-streaming.git
```


#### RN >= 0.60

If you are using RN >= 0.60, only run `npx pod-install`. Then rebuild your project.

## General Usage

For Host 

```js
import { RNBroadCasterStreaming } from 'react-native-streaming';
```

### Basic usage for Host

```js
import React from 'react';
import { RNBroadCasterStreaming } from 'react-native-streaming';

const appId = YOUR_APP_ID;
const channelName = YOUR_CHANNEL_NAME_ID

export const App = () => {
  ...
  
    const onReceiveGift = gift => {};
    const onSelectGame = () => Navigation.navigate('SCREEN', { item: state });
    const onPressAvatar = () => Navigation.navigate('SCREEN');

   return (
      <RNBroadCasterStreaming
          onCloseStream={() => Navigation.back()}
          configLiveStream={{ appId: appId, channelName: channelName }}
          _userInfoSocketChat={{
              user_name: login_informations.full_name,
              user_id: login_informations.id,
              chanel_id: channelName,
          }}
          onReceiveGift={onReceiveGift}
          uid={login_informations.id}
          onPressAvatar={onPressAvatar}
          onSelectGame={onSelectGame}
          onBack={() => Navigation.back()}
          cardName={item.game}
          channelLive={item.chanel}
      />
  );
};
```

For Viewer 

```js
import { RNBroadCasterStreaming } from 'react-native-streaming';
```

### Basic usage for Viewer

```js
import React from 'react';
import { RNAudienceStreaming } from 'react-native-streaming';

const appId = YOUR_APP_ID;
const channelName = YOUR_CHANNEL_NAME_ID

export const App = () => {
  ...
  
    const onReceiveGift = gift => {};
    const onSelectGame = () => Navigation.navigate('SCREEN', { item: state });
    const onPressAvatar = () => Navigation.navigate('SCREEN');

    return (
        <RNAudienceStreaming
            onCloseStream={() => Navigation.back()}
            giftData={get(queryGetGiftAll, 'data', [])}
            configLiveStream={{ appId: appId, channelName: channelName }}
            _userInfoSocketChat={{
                user_name: login_informations.full_name,
                user_id: login_informations.id,
                chanel_id: channelName,
            }}
            onReceiveGift={onReceiveGift}
            rightIconComposer={lottie_gift_box}
        />
    );
  );
};
```

Props

#### `configLiveStream` (`required`) (for Host & Viewer)

Config live streaming.

List of possible values:

- `"appId"` (string)
- `"channelName"` (string)

```js
<RNBroadCasterStreaming configLiveStream={{ appId, channelName }}  />
```

#### `_userInfoSocketChat` (`required`) (for Host & Viewer)

Config chat live streaming

List of possible values:

- `"user_name"` (string)
- `"user_id"` (number)
- `"chanel_id"` (string)

```js
<RNBroadCasterStreaming _userInfoSocketChat={{
                user_name: login_informations.full_name,
                user_id: login_informations.id,
                chanel_id: channelName,
            }}  />
```


#### `uid` (`required`) (for Host)

Pass your host id.

```js
<RNBroadCasterStreaming uid={'YOUR HOST ID'} />
```


#### `onReceiveGift` (`func`) (for Host & Viewer)

Function called when receive gift

```js
<RNBroadCasterStreaming onReceiveGift={(gift)=> {...}} />
```

#### `onCloseStream` (`func`) (for Host & Viewer)

Function called when close stream using to handle Navigation Header go back

```js
<RNBroadCasterStreaming onCloseStream={() => Navigation.back()} />
```

#### `onBack` (`func`) (for Host)

Function called when close stream using to handle Navigation Header go back

```js
<RNBroadCasterStreaming onBack={() => Navigation.back()} />
```


#### `rightIconComposer` (`optional`) (for Host & Viewer)

Add your lottie icon to right composer

```js
<RNAudienceStreaming rightIconComposer={lottie_gift_box} />
```


#### `giftData` (required) (for Viewer)

Array of list gift items

```js
<RNAudienceStreaming giftData={data: IGiftItem[]} />
```

         
