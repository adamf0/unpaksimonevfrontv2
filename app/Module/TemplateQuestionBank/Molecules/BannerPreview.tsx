import Icon from "../../Common/Components/Atoms/Icon";

type Props = {
  onBack?: () => void;
};

export default function BannerPreview({ onBack }: Props) {
  return (
    <div
      className="
        sticky top-0 z-30
        bg-white/85
        backdrop-blur-md
        border-b border-outline-variant/20
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6 md:px-10
          py-4
          flex items-center justify-between
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={onBack}
            className="
              w-11 h-11
              rounded-2xl
              border border-outline-variant/30
              bg-white
              flex items-center justify-center
              hover:bg-surface-container-low
              hover:scale-[1.03]
              active:scale-[0.98]
              transition-all
              shadow-sm
            "
          >
            <Icon name="arrow_back" className="text-on-surface" />
          </button>

          {/* TITLE */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-on-surface">
                Preview Template
              </h1>

              <p className="text-sm text-on-surface-variant">
                Simulasi tampilan kuesioner
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
