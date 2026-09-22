import { useGetUserByIdQuery } from "@/Redux/api/userApi";
import GetUserInfo from "@/service/profile.service";

const useUser = () => {
      const user = GetUserInfo();
      const userId = user?.profileInfo?._id;
    
      const { data: response, isLoading, isError, error } = useGetUserByIdQuery(userId!, {
        skip: !userId,
      });
    
      const currentUser = response?.data;
    
      return {
        currentUser,
        isLoading,
        isError,
        error,
      };
    };

export default useUser;
