import React, { useImperativeHandle, useRef, useState } from 'react';
import {
	Button,
	Modal,
	Form,
	Input,
	Radio,
	Upload,
	DatePicker,
	DatePickerProps,
	TimeRangePickerProps,
	Space,
	Checkbox,
	Col,
	Rate,
	Row,
	Select,
	Slider,
	Switch,
	InputNumber,
} from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { InboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import LocationSearch from '../../components/maps/AutoComplete';
import { fileToBase64 } from '../../lib/file';
import AutoComplete from '../../components/maps/AutoComplete';
import { TripBody } from '@/pages/api/trip';
import { User } from '@/pages/account';

interface FormFields {
	location: string;
	lat: number;
	lon: number;
	desc: string;
	date: string;
}

interface Props {
	user: User;
}
const { TextArea } = Input;

export interface NewTripRef {
	visible: boolean;
	showModal: (visible: boolean) => void;
	okay: () => void;
	cancel: () => void;
}

const NewTripModal: React.ForwardRefRenderFunction<NewTripRef, Props> = ({ user }, ref) => {
	//	const AutoCompleteRef = useRef<AutoCompleteRef>(null);

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [previewTitle, setPreviewTitle] = useState('');
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const [imagesBody, setImagesBody] = useState<UploadFile[]>([]);
	const [form] = Form.useForm<FormFields>();
	const onFileListChange: UploadProps['onChange'] = ({ fileList: files }) => {
		//console.log(imagesBody);
		setImagesBody(files);
	};
	const onFileListPreview = async (file: UploadFile) => {
		let src = file.url as string;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj as RcFile);
				reader.onload = () => resolve(reader.result as string);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [locationCrap, setLocationCRap] = useState<google.maps.places.PlaceResult>();
	useImperativeHandle(ref, () => ({
		visible: isModalOpen,
		cancel: handleCancel,
		okay: handleOk,
		showModal,
	}));

	const showModal = (visible: boolean) => {
		setIsModalOpen(visible);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const { Option } = Select;

	const formItemLayout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 },
	};

	const normFile = (e: any) => {
		//console.log('Upload event:', e);
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	const getThing = (props: google.maps.places.PlaceResult) => {
		//console.log('kekw');
		console.log(props);
		console.log(props.geometry?.location?.lat());
		setLocationCRap(props);
	};
	// const onChange = (value, dateString) => {
	// 	console.log('Selected Time: ', value);
	// 	console.log('Formatted Selected Time: ', dateString);
	// };

	// const getBase64 = (file: RcFile): Promise<string> =>
	// 	new Promise((resolve, reject) => {
	// 		const reader = new FileReader();
	// 		reader.readAsDataURL(file);
	// 		reader.onload = () => resolve(reader.result as string);
	// 		reader.onerror = (error) => reject(error);
	// 	});
	return (
		<>
			<Modal title="New Trip" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				<Form
					form={form}
					name="validate_other"
					{...formItemLayout}
					onFinish={async ({ date, desc, location, lat, lon }) => {
						// When the form is submitted, convert the images to base64 and trigger the GQL mutation

						try {
							const promises = imagesBody.map((img) => {
								if (img.originFileObj) {
									return fileToBase64(img.originFileObj);
								}
							});
							const base64 = (await Promise.all(promises)).filter((img) => {
								img !== undefined;
							}) as string[];

							fetch(`http://localhost:3000/api/trip`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									userId: user.id,
									location: locationCrap?.formatted_address ?? '',
									lat: locationCrap?.geometry?.location?.lat(),
									lon: locationCrap?.geometry?.location?.lng(),
									desc,
									date,
								} as TripBody),
							});

							//console.log(data);
							console.log(locationCrap);
							// const imageBody = await fileToBase64(imagesBody[0].originFileObj);
						} catch (e: any) {
							//setError(e);
						}
					}}
				>
					<Form.Item
						label="Date"
						name="date"
						rules={[{ required: false, message: 'Please input your description!' }]}
					>
						<DatePicker></DatePicker>
					</Form.Item>
					<Form.Item
						label="Location"
						name="location"
						rules={[{ required: false, message: 'Please input your description!' }]}
					>
						<LocationSearch getThing={getThing} />
					</Form.Item>
					<Form.Item
						label="Describe your trip!"
						name="desc"
						rules={[{ required: false, message: 'Please input your description!' }]}
					>
						<TextArea rows={4} />
					</Form.Item>
					<Form.Item>
						<Upload
							name="picture"
							fileList={imagesBody}
							onChange={(ee) => onFileListChange(ee)}
							onPreview={onFileListPreview}
							maxCount={10}
							multiple={false}
						>
							<Button icon={<UploadOutlined />}>Click to Upload</Button>
						</Upload>
					</Form.Item>
					<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
						<Button className="shadow shadow-md shadow-2xl" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>

				<Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</Modal>
		</>
	);
};

export default React.forwardRef<NewTripRef, Props>(NewTripModal);
