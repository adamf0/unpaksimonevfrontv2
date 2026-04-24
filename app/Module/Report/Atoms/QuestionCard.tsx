export default function QuestionCard({
  rank,
  title,
  category,
  score,
  labelColor,
}: {
  rank: string;
  title: string;
  category: string;
  score: string;
  labelColor: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl flex items-center gap-4 group hover:shadow-lg transition-all border border-transparent hover:border-indigo-50">
      <span className="w-10 h-10 flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black">
        {rank}
      </span>

      <div className="flex-1">
        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">
          {title}
        </h4>

        <p className="text-[10px] text-outline font-medium mt-1">
          Category: {category}
        </p>
      </div>

      <div className="text-right">
        <span className={`text-lg font-black text-[#2c2a51] ${labelColor}`}>
          {score}
        </span>
      </div>
    </div>
  );
}