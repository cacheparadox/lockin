import DashboardLayout from "@/app/dashboard/layout";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ContractForm from "./ContractForm";

export default async function NewContractPage({ searchParams }: { searchParams: { error?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch groups where user is member
  const { data: memberships } = await supabase
    .from("li_group_members")
    .select("group_id, li_groups(name)")
    .eq("user_id", user.id);

  const groups = memberships?.map(m => ({
    id: m.group_id,
    // @ts-ignore
    name: m.li_groups?.name || "Unknown Group"
  })) || [];

  let membersByGroup = {};
  
  if (groups.length > 0) {
    const groupIds = groups.map(g => g.id);
    const { data: allMembers } = await supabase
      .from("li_group_members")
      .select("group_id, user_id, li_profiles(username)")
      .in("group_id", groupIds);

    membersByGroup = allMembers?.reduce((acc: any, m: any) => {
      if (!acc[m.group_id]) acc[m.group_id] = [];
      acc[m.group_id].push({
        id: m.user_id,
        username: m.li_profiles?.username || "Unknown"
      });
      return acc;
    }, {}) || {};
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="border-b-4 border-primary pb-6">
          <h1 className="text-5xl font-heading font-black uppercase">Assign Contract</h1>
          <p className="text-xl font-bold text-muted-foreground mt-2 uppercase">Forge a binding task for a group member.</p>
        </header>

        {searchParams?.error && (
          <div className="bg-destructive/20 border-4 border-destructive p-4 text-destructive font-black uppercase">
            {searchParams.error}
          </div>
        )}

        <ContractForm groups={groups} membersByGroup={membersByGroup} />
      </div>
    </DashboardLayout>
  );
}
