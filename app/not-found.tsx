import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-6">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🍽️</div>
        <h1 className="text-2xl font-heading font-bold text-[#3d2e1f] mb-2">
          ページが見つかりません
        </h1>
        <p className="text-sm text-[#8B6F61] mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#FF6B35] text-white font-bold hover:bg-[#E55A2B] transition-all shadow-md"
        >
          トップに戻る
        </Link>
      </div>
    </main>
  );
}
