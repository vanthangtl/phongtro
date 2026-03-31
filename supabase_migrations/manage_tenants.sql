-- CẬP NHẬT DATABASE CHO TÍNH NĂNG QUẢN LÝ KHÁCH THUÊ (TENANTS)

-- 1. Tạo bảng tenants
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật RLS cho bảng tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách RLS cho tenants (Allow all authenticated or open, tuỳ setting dự án)
-- Dưới đây mở policy cho Role anon & authenticated để phù hợp app demo (tuỳ biến nếu cần)
CREATE POLICY "Allow ALL operations for tenants" ON public.tenants
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Tạo hàm trích xuất cập nhật trạng thái phòng (Trigger function)
CREATE OR REPLACE FUNCTION update_room_status_on_tenant_change()
RETURNS TRIGGER AS $$
DECLARE
    tenant_count INT;
BEGIN
    -- NẾU THÊM MỚI HOẶC SỬA (kèm room_id): Cập nhật phòng mới thành OCCUPIED
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.room_id IS NOT NULL THEN
        UPDATE public.rooms SET status = 'OCCUPIED' WHERE id = NEW.room_id;
    END IF;

    -- NẾU XÓA HOẶC SỬA (đổi phòng / gỡ phòng): Kiểm tra phòng cũ
    IF (TG_OP = 'DELETE') OR (TG_OP = 'UPDATE' AND OLD.room_id IS DISTINCT FROM NEW.room_id) THEN
        IF OLD.room_id IS NOT NULL THEN
            -- Đếm số khách hiện tại trong phòng cũ
            SELECT count(*) INTO tenant_count FROM public.tenants WHERE room_id = OLD.room_id;
            
            -- Nếu không còn khách nào, chuyển về AVAILABLE
            IF tenant_count = 0 THEN
                UPDATE public.rooms SET status = 'AVAILABLE' WHERE id = OLD.room_id;
            END IF;
        END IF;
    END IF;

    -- Ràng buộc trả về cho Trigger
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Gán Trigger vào bảng tenants
DROP TRIGGER IF EXISTS trigger_update_room_status ON public.tenants;
CREATE TRIGGER trigger_update_room_status
AFTER INSERT OR UPDATE OR DELETE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION update_room_status_on_tenant_change();
