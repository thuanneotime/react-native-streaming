import { isAndroid, isIOS } from '../utils/deviceInfo';
import React from 'react';
import RtcEngine, {
    ChannelProfile,
    ClientRole,
    ConnectionChangedReason,
    ConnectionStateType,
} from 'react-native-agora';
import { requestCameraAndAudioPermission } from '../utils/permissions';
import { LiveStreamState } from './dtos';
import { RNBroadCasterStreamingProps } from '../index';

// Define a Props interface.
interface Props {}

// Define a State interface.
interface State {
    token: string;
    joinSucceed: boolean;
    peerIds: number[];
    isHost: Boolean;
    switchCamera: Boolean;
    connectionState: ConnectionStateType;
}

const withHostLiveStreaming = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    class HostLiveStreaming extends React.PureComponent<P & RNBroadCasterStreamingProps> {
        _engine?: RtcEngine;

        state: LiveStreamState = {
            token: null,
            joinSucceed: false,
            peerIds: [],
            isHost: true,
            switchCamera: true,
            connectionState: ConnectionStateType.Connecting,
        };

        onClose = async () => {
            await this._endCall();
        };

        backAction = () => {
            this.onClose();
            return true;
        };

        componentDidMount() {
            if (isAndroid) {
                requestCameraAndAudioPermission().then(() => {
                    console.log('requested!');
                });
            }
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.backAction);
        }

        componentWillUnmount() {
            this.backHandler.remove();
        }

        _startCall = async (channelName: string, uid: number) => {
            await this._engine?.joinChannel(this.state.token, channelName, null, uid);
        };

        _endCall = async () => {
            await this._engine?.leaveChannel();
            this.setState({ peerIds: [], joinSucceed: false });
        };

        _switchCamera = () => {
            const { switchCamera } = this.state;
            this._engine
                ?.switchCamera()
                .then(() => {
                    this.setState({ switchCamera: !switchCamera });
                })
                .catch(err => {
                    console.warn('switchCamera', err);
                });
        };

        // Pass in your App ID through this.state, create and initialize an RtcEngine object.
        init = async (appId: string) => {
            this._engine = await RtcEngine.create(appId);

            // Enable the video module.
            await this._engine.enableVideo();

            // Enable the local video preview.
            await this._engine.startPreview();

            await this._engine.setBeautyEffectOptions(true, {});

            // await this._engine.enableVirtualBackground(true, {});
            // Set the channel profile as live streaming.
            await this._engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
            // Set the usr role as host.
            await this._engine.setClientRole(ClientRole.Broadcaster);

            // Listen for the UserJoined callback.
            // This callback occurs when the remote user successfully joins the channel.
            this._engine.addListener('UserJoined', (uid, elapsed) => {
                console.log('UserJoined', uid, elapsed);
                const { peerIds } = this.state;
                if (peerIds.indexOf(uid) === -1) {
                    this.setState({
                        peerIds: [...peerIds, uid],
                    });
                }
            });

            // Listen for the UserOffline callback.
            // This callback occurs when the remote user leaves the channel or drops offline.
            this._engine.addListener('UserOffline', (uid, reason) => {
                console.log('UserOffline', uid, reason);
                const { peerIds } = this.state;
                this.setState({
                    // Remove peer ID from state array
                    peerIds: peerIds.filter(id => id !== uid),
                });
            });

            // Listen for the JoinChannelSuccess callback.
            // This callback occurs when the local user successfully joins the channel.
            this._engine.addListener('JoinChannelSuccess', async (channel, uid, elapsed) => {
                console.log('JoinChannelSuccess', channel, uid, elapsed);
                this.setState({
                    joinSucceed: true,
                });

                await this._engine.muteAllRemoteAudioStreams(true);
                await this._engine.muteAllRemoteVideoStreams(true);
            });

            // this._engine.addListener('Warning', warn => console.log('Warn', warn));
            this._engine.addListener('Error', error => console.log('Error', error));

            this._engine.addListener(
                'ConnectionStateChanged',
                (state: ConnectionStateType, reason: ConnectionChangedReason) => {
                    console.log('ConnectionStateChanged', state, reason);
                    this.setState({ connectionState: state });
                },
            );
        };

        render(): React.ReactNode {
            return (
                <WrappedComponent
                    {...(this.props as P)}
                    {...this.state}
                    init={this.init}
                    startCall={this._startCall}
                    endCall={this._endCall}
                    switchCamera={this._switchCamera}
                />
            );
        }
    }

    return HostLiveStreaming;
};

export default withHostLiveStreaming;