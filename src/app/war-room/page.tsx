import DashboardLayout from "@/app/dashboard/layout";
import { MessageSquare, ThumbsUp, Flame } from "lucide-react";

export default function WarRoomPage() {
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
          <WarRoomPost 
            author="David G." 
            level="Lvl 44 Warlord" 
            time="1 hour ago"
            content="If you're reading this instead of working, you're losing."
            hasImage={true}
            likes={12}
            comments={3}
          />
          <WarRoomPost 
            author="Sarah" 
            level="Lvl 29 Ironblood" 
            time="4 hours ago"
            content="Finished the Q3 roadmap. Time to lift."
            likes={8}
            comments={1}
          />
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
