import moment from "moment";

function CommentCard({ comment, onDelete }) {
  return (
    <div className="relative bg-white/90 dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-md transition duration-300 group">
      {/* Top Row: Author + Time + Delete */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-[#4b0082] dark:text-yellow-300 text-sm tracking-wide">
          {comment?.user?.name || "Anonymous"}
        </span>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 italic">
            {moment(comment.createdAt).fromNow()}
          </span>

          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-red-500 dark:text-red-400 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Comment Text */}
      <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed whitespace-pre-line">
        {comment.text || "No comment content."}
      </p>
    </div>
  );
}

export default CommentCard;
