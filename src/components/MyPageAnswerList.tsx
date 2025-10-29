
import { useGetAnswers } from "../queries/AnswerQuery";                                   
import Answer from "./Answer";
import { useGetUser } from "../queries/AuthQuery";

const MyPageAnswerList = () => {
  const { data: user } = useGetUser();
  const { data: answers, isLoading, isFetching } = useGetAnswers(user?.id);
  return (
    <div className="mb-5">
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>{answers?.map((answer) => <Answer key={answer.id} answer={answer} />)}</>
        )}
      </div>
    </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
  );
};

export default MyPageAnswerList;
