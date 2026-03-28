import { DialogProfile } from "@/components/profiles/profile-form";

export default function TestPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Trang Test</h1>
      <p className="mt-2 text-gray-600">
        Đây là trang test để kiểm tra các component.
      </p>
      {/* <ProfileForm /> */}
      <DialogProfile />
    </div>
  );
}
