import { createClient } from "@/utils/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-10">
      <h1>Trạng thái đăng nhập:</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
