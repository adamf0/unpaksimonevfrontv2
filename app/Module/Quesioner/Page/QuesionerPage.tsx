import UserPanelTemplate from "../../Common/Components/Template/UserPanelTemplate";
import QuesionerBuilderTemplate from "../Template/QuesionerBuilderTemplate";

type Props = {
  uuid: string;
};

export default function QuesionerPage({ uuid }: Props) {
  return (
    <UserPanelTemplate>
      <QuesionerBuilderTemplate uuid={uuid} />
    </UserPanelTemplate>
  );
}