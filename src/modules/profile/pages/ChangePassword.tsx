import { Button, Card, Form, Input, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PageMeta from '../../../components/common/PageMeta';
import { onChangePasswordApi } from '../../account/services/api';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({ mutationFn: onChangePasswordApi });
  const submit = (values: { currentPassword: string; newPassword: string }) => mutate(values, {
    onSuccess: () => { message.success('Đổi mật khẩu thành công'); navigate('/profile'); },
    onError: (error: any) => message.error(error?.response?.data?.message || error?.message || 'Đổi mật khẩu thất bại'),
  });
  return <main className="flex min-h-[75vh] items-center justify-center bg-[#F9F7F5] px-4 py-12"><PageMeta title="Đổi mật khẩu - Bếp Việt" indexable={false}/>
    <Card className="w-full max-w-2xl rounded-3xl border-0 p-4 shadow-sm sm:p-8">
      <h1 className="text-2xl font-black text-[#5C4033]">Đổi mật khẩu</h1><p className="mb-7 mt-2 text-sm text-gray-500">Xác nhận mật khẩu hiện tại trước khi đặt mật khẩu mới.</p>
      <Form layout="vertical" size="large" onFinish={submit} requiredMark={false}>
        <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{required:true,message:'Nhập mật khẩu hiện tại'}]}><Input.Password prefix={<LockOutlined/>} autoComplete="current-password"/></Form.Item>
        <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{required:true,message:'Nhập mật khẩu mới'},{min:8,message:'Mật khẩu cần ít nhất 8 ký tự'}]}><Input.Password prefix={<LockOutlined/>} autoComplete="new-password"/></Form.Item>
        <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" dependencies={['newPassword']} rules={[{required:true,message:'Xác nhận mật khẩu mới'}, ({ getFieldValue }) => ({ validator: (_, value) => !value || getFieldValue('newPassword') === value ? Promise.resolve() : Promise.reject(new Error('Mật khẩu xác nhận không khớp')) })]}>
          <Input.Password prefix={<LockOutlined/>} autoComplete="new-password"/>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending} block className="h-12 rounded-xl bg-orange-600 font-bold">Cập nhật mật khẩu</Button>
      </Form>
    </Card>
  </main>;
}
