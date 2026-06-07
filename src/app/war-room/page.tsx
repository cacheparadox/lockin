import DashboardLayout from "@/app/dashboard/layout";
import { MessageSquare, Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function WarRoomPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch recent posts
  const { data: posts } = await supabase
    .from("li_war_room_posts")
    .select("*, li_profiles(username, level)")
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <div className="space-y-10 max-w-4xl mx-auto">
        <header className="border-b-4 border-primary pb-6 text-center">
          <h1 className="text-6xl font-heading font-black uppercase text-destructive tracking-widest">War Room</h1>
          <p className="text-xl font-bold text-muted-foreground mt-4 uppercase">Where excuses go to die.</p>
        </header>

        <div className="border-4 border-primary bg-background p-6 shadow-brutalist">
          <textarea 
            className="w-full bg-transparent border-none text-2xl font-bold outline-none resize-none placeholder-muted-foreground uppercase"
            rows={3}
            placeholder="POST YOUR PROOF. ROAST YOUR FRIENDS."
          ></textarea>
          <div className="flex justify-between items-center mt-4 border-t-4 border-primary pt-4">
            <button className="border-2 border-primary px-4 py-2 font-bold uppercase hover:bg-muted transition-colors">
              + Add Image
            </button>
            <button className="bg-destructive text-primary-foreground px-8 py-3 font-black text-xl uppercase hover:bg-primary transition-colors shadow-brutalist">
              Post
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {posts && posts.length > 0 ? (
            posts.map(post => (
              <WarRoomPost 
                key={post.id}
                author={(post as any).li_profiles?.username || "Unknown"} 
                level={`Lvl ${(post as any).li_profiles?.level || 1}`} 
                time={new Date(post.created_at).toLocaleDateString()}
                content={post.caption}
                hasImage={!!post.image_url}
                likes={0}
                comments={0}
              />
            ))
          ) : (
            <div className="border-4 border-border p-10 bg-card text-center text-muted-foreground font-bold uppercase text-2xl">
              THE WAR ROOM IS SILENT. BE THE FIRST TO STRIKE.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function WarRoomPost({ author, level, time, content, hasImage, likes, comments }: any) {
  return (
    <article className="border-4 border-primary bg-card shadow-brutalist overflow-hidden">
      <div className="p-6 border-b-4 border-primary bg-muted flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-accent border-4 border-primary"></div>
          <div>
            <h3 className="font-black text-2xl uppercase">{author}</h3>
            <span className="font-bold text-destructive uppercase">{level}</span>
          </div>
        </div>
        <span className="font-bold text-muted-foreground uppercase">{time}</span>
      </div>
      
      {hasImage && (
        <div className="border-b-4 border-primary">
          <div className="w-full h-96 bg-muted flex items-center justify-center font-bold text-muted-foreground uppercase border-2 border-primary">
            [Proof Image Uploaded]
          </div>
        </div>
      )}
      
      <div className="p-6">
        <p className="text-2xl font-bold uppercase">{content}</p>
      </div>

      <div className="p-4 border-t-4 border-primary bg-muted flex gap-6">
        <button className="flex items-center gap-2 font-bold uppercase hover:text-accent transition-colors">
          <Flame size={24} /> {likes} Fire
        </button>
        <button className="flex items-center gap-2 font-bold uppercase hover:text-primary transition-colors">
          <MessageSquare size={24} /> {comments} Comments
        </button>
      </div>
    </article>
  );
}
