import { auth } from "@/lib/auth";
import { Button, Card, PageShell } from "@/components/ui";

export default async function AdminPage() {
  const session = await auth();
  const isStaff = (session as any)?.isStaff;

  if (!session) {
    return (
      <PageShell>
        <Card className="p-8">
          <h1 className="text-3xl font-black">Admin Login Required</h1>
          <p className="mt-2 text-zinc-400">Login with Discord to access staff tools.</p>
          <form action="/api/auth/signin" method="post" className="mt-6">
            <Button>Login With Discord</Button>
          </form>
        </Card>
      </PageShell>
    );
  }

  if (!isStaff) {
    return <PageShell><Card className="p-8"><h1 className="text-3xl font-black text-red-300">No Access</h1><p className="mt-2 text-zinc-400">Your Discord account is not listed as staff/dev.</p></Card></PageShell>;
  }

  return (
    <PageShell>
      <h1 className="mb-2 text-4xl font-black">Admin Dashboard</h1>
      <p className="mb-8 text-zinc-400">Staff-only tools. These update your existing PostgreSQL database.</p>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-2xl font-black">Suspend Player</h2>
          <form action="/api/admin/suspend" method="post" className="mt-5 space-y-3">
            <input name="discordId" placeholder="Discord ID" className="w-full rounded-xl bg-zinc-950 p-3 outline-none ring-1 ring-zinc-800" />
            <select name="action" className="w-full rounded-xl bg-zinc-950 p-3 outline-none ring-1 ring-zinc-800"><option value="suspend">Suspend</option><option value="unsuspend">Unsuspend</option><option value="blacklist">Blacklist</option><option value="unblacklist">Unblacklist</option></select>
            <Button>Submit</Button>
          </form>
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-black">Add MVP</h2>
          <form action="/api/admin/mvp" method="post" className="mt-5 space-y-3">
            <input name="discordId" placeholder="Discord ID" className="w-full rounded-xl bg-zinc-950 p-3 outline-none ring-1 ring-zinc-800" />
            <input name="amount" defaultValue="1" className="w-full rounded-xl bg-zinc-950 p-3 outline-none ring-1 ring-zinc-800" />
            <Button>Add MVP</Button>
          </form>
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-black">Log Placement</h2>
          <form action="/api/admin/placement" method="post" className="mt-5 space-y-3">
            <input name="discordId" placeholder="Discord ID" className="w-full rounded-xl bg-zinc-950 p-3 outline-none ring-1 ring-zinc-800" />
            <input name="result" placeholder="win/loss/notes" className="w-full rounded-xl bg-zinc-950 p-3 outline-none ring-1 ring-zinc-800" />
            <Button>Log</Button>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}
