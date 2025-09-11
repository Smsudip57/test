import Editwebsite from "@/components/website/editwebsite";
import Chat from "@/components/chat/adminchat";

export default async function Page({ params }) {
  const slug = await params.slug;

  const renderContent = () => {
    if (!slug) {
      return (
        <div className="p-6 pt-24 h-[200vh]">
          <h1 className="text-2xl font-bold">Welcome to Admin CMS!</h1>
          <p className="mt-4">Select a section to manage.</p>
        </div>
      );
    }

    switch (slug[0]) {
      case "website":
        return <Editwebsite params={slug} />;
      case "chat":
        return <Chat params={slug} />;
      default:
        return (
          <div className="p-6 pt-24 h-[200vh]">
            <h1 className="text-2xl font-bold">Admin CMS</h1>
            <p className="mt-4">Unknown section: {slug[0]}</p>
          </div>
        );
    }
  };

  return renderContent();
}
