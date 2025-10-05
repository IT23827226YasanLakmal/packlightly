type Props = {
  title: string;
  time: string;
  author: string;
};

const PostListItem: React.FC<Props> = ({ title, time, author }) => {
  return (
    <>
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-[#0e1b13] text-base font-medium leading-normal">{title}</p>
        <p className="text-[#4e976b] text-sm font-normal leading-normal">{time}</p>
        <p className="text-[#4e976b] text-sm font-normal leading-normal">Posted by {author}</p>
      </div>

      <div className="shrink-0">
        <div className="text-[#0e1b13] flex w-7 h-7 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"/>
          </svg>
        </div>
      </div>
    </>
  );
};

export default PostListItem;
