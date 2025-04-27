interface Props {
  api_url: string;
}
export const config: Props = {
  api_url: process.env.NEXT_PUBLIC_API_URL || "",
};
