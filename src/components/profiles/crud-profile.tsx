import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/**
 * 1. Hàm cập nhật thông tin cơ bản (Tên và Link ảnh) vào Metadata
 * Cách này nhanh, không cần tạo bảng mới trong Database.
 **/
export async function updateProfileMetadata(
  fullName: string,
  avatarUrl: string,
) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_url: avatarUrl,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Lỗi cập nhật Metadata:", error.message);
    return { data: null, error: error.message };
  }
}

/**
 * 2. Hàm tải ảnh lên Supabase Storage và lấy Link URL
 * @param file - File ảnh lấy từ <input type="file" />
 * @param bucket - Tên thùng chứa trên Supabase (VD: "avatars")
 **/
export async function uploadAvatar(file: File, bucket: string = "avatars") {
  try {
    // Tạo tên file duy nhất để tránh trùng lặp (VD: 123456789-avatar.png)
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Tải file lên Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Lấy URL công khai để có thể hiển thị trên <img> hoặc <Avatar />
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { publicUrl: data.publicUrl, error: null };
  } catch (error: any) {
    console.error("Lỗi upload ảnh:", error.message);
    return { publicUrl: null, error: error.message };
  }
}

/**
 * 3. Hàm tổng hợp: Vừa upload ảnh vừa cập nhật Profile
 * Dùng hàm này khi bạn có một Form chỉnh sửa thông tin.
 **/
export async function handleFullProfileUpdate(
  fullName: string,
  imageFile?: File,
) {
  let currentAvatarUrl = "";

  // Nếu có chọn file ảnh mới -> Upload trước
  if (imageFile) {
    const { publicUrl, error } = await uploadAvatar(imageFile);
    if (error) return { success: false, message: error };
    currentAvatarUrl = publicUrl || "";
  }

  // Cập nhật tên và ảnh vào User Metadata
  const { error } = await updateProfileMetadata(fullName, currentAvatarUrl);

  if (error) return { success: false, message: error };
  return { success: true, message: "Cập nhật thành công!" };
}
