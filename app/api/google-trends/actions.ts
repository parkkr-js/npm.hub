// app/api/google-trends/actions.ts
import { TrendsData } from '@/types/google-trends';
import { removeSpecialChars } from '@/lib/utils';

export async function fetchGoogleTrends(packageName: string): Promise<TrendsData> {
  try {
    //packageName = 'test-error-429';
    let modifiedPackageName = decodeURIComponent(packageName);

    modifiedPackageName = removeSpecialChars(modifiedPackageName);

    const url = `/api/google-trends?keyword=${modifiedPackageName}`;

    const response = await fetch(url);

    // if (packageName.includes('test-error')) {
    //   const errorType = packageName.split('test-error-')[1];
    //   const error = new Error();

    //   switch (errorType) {
    //     case '404':
    //       error.message = '검색 결과를 찾을 수 없습니다';
    //       (error as any).status = 404;
    //       throw error;
    //     case '403':
    //       error.message = 'API 키가 유효하지 않습니다';
    //       (error as any).status = 403;
    //       throw error;
    //     case '429':
    //       error.message = '호출 한도 초과';
    //       (error as any).status = 429;
    //       throw error;
    //     case '500':
    //       error.message = '서버 오류';
    //       (error as any).status = 500;
    //       throw error;
    //     case 'network':
    //       error.message = '네트워크 문제로 인해 데이터를 가져오지 못했습니다';
    //       throw error;
    //     default:
    //       // 일반 실행 계속
    //       break;
    //   }
    // }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      const error = new Error(`API Error: ${response.status} - ${errorText}`);
      (error as any).status = response.status;
      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const error = new Error(`잘못된 응답 타입: ${contentType}`);
      (error as any).status = 400;
      throw error;
    }
    const data = await response.json();

    if (!data.interest || !Array.isArray(data.interest)) {
      const error = new Error('유효하지 않은 데이터 형식');
      (error as any).status = 404;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('fetchGoogleTrends 에러:', error);
    throw error;
  }
}
