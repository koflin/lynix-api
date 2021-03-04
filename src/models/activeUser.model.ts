import { Socket } from 'socket.io';

import { LocalUser } from './localUser.model';

export interface ActiveUser {
    user: LocalUser;
    client: Socket;
}