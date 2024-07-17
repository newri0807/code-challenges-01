import create from "zustand";

// TweetStore 인터페이스 정의
interface ResponseStore {
    // tweetId를 키로 사용하여 댓글 수를 저장하는 객체
    commentCounts: {[tweetId: number]: number};

    // 특정 트윗의 댓글 수를 설정하는 메서드
    setCommentCount: (tweetId: number, count: number) => void;

    // 특정 트윗의 댓글 수를 업데이트(증가 또는 감소)하는 메서드
    updateCommentCount: (tweetId: number, increment: number) => void;
}

// 트윗 관련 상태 관리를 위한 Zustand 스토어 생성
export const useResponseStore = create<ResponseStore>((set) => ({
    // 초기 상태: 빈 객체로 댓글 수 초기화
    commentCounts: {},

    // 특정 트윗의 댓글 수를 설정하는 메서드 구현
    setCommentCount: (tweetId, count) =>
        set((state) => ({
            commentCounts: {
                // 기존의 댓글 수를 스프레드 연산자로 포함
                ...state.commentCounts,
                // 주어진 tweetId에 대한 새로운 댓글 수 설정
                [tweetId]: count,
            },
        })),

    // 특정 트윗의 댓글 수를 업데이트(증가 또는 감소)하는 메서드 구현
    updateCommentCount: (tweetId, increment) =>
        set((state) => ({
            commentCounts: {
                // 기존의 댓글 수를 스프레드 연산자로 포함
                ...state.commentCounts,
                // 주어진 tweetId에 대한 댓글 수를 증가 또는 감소
                [tweetId]: (state.commentCounts[tweetId] || 0) + increment,
            },
        })),
}));
