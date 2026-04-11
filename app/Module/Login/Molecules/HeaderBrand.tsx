import Icon from "../../Common/Components/Atoms/Icon";

export default function HeaderBrand() {
  return (
    <header className="flex items-center gap-3">
      <div className="bg-surface-container-lowest/20 backdrop-blur-md p-2.5 rounded-xl border border-white/20">
        <span className="text-3xl leading-none">
          <Icon name="school" className="!text-3xl block"/>
        </span>
      </div>
      <h1 className="font-headline text-3xl font-extrabold tracking-tight">
        Unpak Simonev
      </h1>
    </header>
  );
}
