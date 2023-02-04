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
import LocationSearch, { onPlaceSelected } from '../../components/maps/AutoComplete';
import { fileToBase64 } from '../../lib/file';
import AutoComplete from '../../components/maps/AutoComplete';

interface FormFields {
	name: string;
	title: string;
	imageBody: UploadFile[];
}

interface Props {}
const { TextArea } = Input;

export interface NewTripRef {
	visible: boolean;
	showModal: (visible: boolean) => void;
	okay: () => void;
	cancel: () => void;
}

const NewTripModal: React.ForwardRefRenderFunction<NewTripRef, Props> = ({}, ref) => {
	const AutoCompleteRef = useRef<AutoCompleteRef>(null);

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [previewTitle, setPreviewTitle] = useState('');
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	// const { RangePicker } = DatePicker;

	// const handlePreview = async (file: UploadFile) => {
	// 	if (!file.url && !file.preview) {
	// 		file.preview = await getBase64(file.originFileObj as RcFile);
	// 	}

	// 	setPreviewImage(file.url || (file.preview as string));
	// 	setPreviewOpen(true);
	// 	setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
	// };

	// const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

	// const uploadButton = (
	// 	<div>
	// 		<PlusOutlined />
	// 		<div style={{ marginTop: 8 }}>Upload</div>
	// 	</div>
	// );

	// const onFinish = (values: any) => {
	// 	console.log('Success:', values);
	// };

	// const onFinishFailed = (errorInfo: any) => {
	// 	console.log('Failed:', errorInfo);
	// };
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
	const [locationCrap, setLocationCRap] = useState();
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

	const getThing = (props) => {
		console.log('kekw');
		//console.log(props);
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
					onFinish={async (data) => {
						// When the form is submitted, convert the images to base64 and trigger the GQL mutation
						if (imagesBody[0].originFileObj) {
							try {
								console.log(data);
								console.log(locationCrap);
								const imageBody = await fileToBase64(imagesBody[0].originFileObj);
							} catch (e: any) {
								//setError(e);
							}
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
						<LocationSearch getThing={getThing} ref={onPlaceSelected} />
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
				{/* <LocationSearch></LocationSearch> */}
				{/* <RangePicker onChange={onChange} />
				<Upload
					action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
					listType="picture-card"
					fileList={fileList}
					onPreview={handlePreview}
					onChange={handleChange}
				>
					{fileList.length >= 8 ? null : uploadButton}
				</Upload>
				<Form
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					style={{ maxWidth: 600 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item label="Bio" name="Bio" rules={[{ required: false, message: 'Please input your Bio!' }]}>
						<TextArea rows={4} />
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							Save
						</Button>
					</Form.Item>
				</Form> */}
				<Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</Modal>
		</>
	);
};

export default React.forwardRef<NewTripRef, Props>(NewTripModal);
