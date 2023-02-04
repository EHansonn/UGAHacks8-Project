import { Fragment, useRef, useState } from 'react';
import { Button, Space, Radio, RadioChangeEvent } from 'antd';
import { UserGetResponse } from '@/pages/api/user/[id]';
import EditBioModal from 'components/modals/EditBioModal';
import { EditBioRef } from 'components/modals/EditBioModal';
import NewTripModal, { NewTripRef } from 'components/modals/NewTripModal';
import { User } from '@/pages/account';

interface Props {
	user: User;
}

const Settings: React.FC<Props> = ({ user }) => {
	const editBioRef = useRef<EditBioRef>(null);
	const newTripRef = useRef<NewTripRef>(null);

	return (
		<>
			<Button
				className="text-black"
				style={{ background: 'white', borderColor: 'White' }}
				onClick={() => editBioRef.current?.showModal(true)}
				type="primary"
			>
				Edit Bio
			</Button>
			<Button
				className="text-black"
				style={{ background: 'white', borderColor: 'White' }}
				onClick={() => newTripRef.current?.showModal(true)}
				type="primary"
			>
				New Trip
			</Button>
			<div className="text-black"></div>
			<EditBioModal user={user} ref={editBioRef} />
			<NewTripModal ref={newTripRef} />
		</>
	);
};

export default Settings;
