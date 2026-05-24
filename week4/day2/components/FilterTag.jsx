'use client';

export default function FilterTag({ text, isRemovable, onClick, onRemove }) {
  if (isRemovable) {
    return (
      <div className="flex items-center overflow-hidden rounded-[4px] bg-neutral-filter h-8">
        <span className="font-bold text-primary px-2 text-sm pt-1 pb-0.5">{text}</span>
        <button
          onClick={onRemove}
          className="bg-primary hover:bg-neutral-very-dark transition-colors h-full w-8 flex items-center justify-center cursor-pointer"
          aria-label={`Remove ${text} filter`}
        >
          <img src="/images/icon-remove.svg" alt="" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="font-bold text-primary bg-neutral-filter hover:bg-primary hover:text-white transition-colors rounded-[4px] px-2 h-8 text-sm pt-1 pb-0.5 cursor-pointer"
    >
      {text}
    </button>
  );
}
