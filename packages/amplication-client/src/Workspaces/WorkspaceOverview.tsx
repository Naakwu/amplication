import {
  Button,
  Chip,
  CircleBadge,
  EnumButtonStyle,
  EnumChipStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumIconPosition,
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  HorizontalRule,
  Panel,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { useQuery } from "@apollo/client";
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import AddNewProject from "../Project/AddNewProject";
import ProjectList from "../Project/ProjectList";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { EnumSubscriptionPlan } from "../models";
import { GET_WORKSPACE_MEMBERS, TData as MemberListData } from "./MemberList";
import WorkspaceSelector, { getWorkspaceColor } from "./WorkspaceSelector";
import { UsageInsights } from "../UsageInsights/UsageInsights";
import "./WorkspaceOverview.scss";

const CLASS_NAME = "workspace-overview";
const PAGE_TITLE = "Workspace Overview";

const SUBSCRIPTION_TO_CHIP_STYLE: {
  [key in EnumSubscriptionPlan]: EnumChipStyle;
} = {
  [EnumSubscriptionPlan.Free]: EnumChipStyle.ThemePurple,
  [EnumSubscriptionPlan.Pro]: EnumChipStyle.ThemeBlue,
  [EnumSubscriptionPlan.Enterprise]: EnumChipStyle.ThemeGreen,
  [EnumSubscriptionPlan.PreviewBreakTheMonolith]: EnumChipStyle.ThemeOrange,
  [EnumSubscriptionPlan.Essential]: EnumChipStyle.ThemeBlue,
};

export const WorkspaceOverview = () => {
  const { currentWorkspace, projectsList } = useContext(AppContext);
  const projectIds = useMemo(
    () => projectsList.map((project) => project.id),
    [projectsList]
  );

  const { data: membersData } = useQuery<MemberListData>(GET_WORKSPACE_MEMBERS);

  const membersCount = useMemo(() => {
    return (
      membersData?.workspaceMembers.filter(
        (member) => member.type === models.EnumWorkspaceMemberType.User
      ).length || 0
    );
  }, [membersData]);

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        start={<TabContentTitle title="Workspace" />}
        end={<AddNewProject projectsLength={projectsList.length} />}
        margin={EnumFlexItemMargin.None}
      />
      <HorizontalRule doubleSpacing />

      <Panel panelStyle={EnumPanelStyle.Bold}>
        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          start={
            <CircleBadge
              size="xlarge"
              name={currentWorkspace.name || ""}
              color={getWorkspaceColor(
                currentWorkspace.subscription?.subscriptionPlan
              )}
            />
          }
        >
          <FlexItem
            direction={EnumFlexDirection.Column}
            gap={EnumGapSize.Small}
          >
            <Chip
              chipStyle={
                SUBSCRIPTION_TO_CHIP_STYLE[
                  currentWorkspace.subscription?.subscriptionPlan
                ]
              }
            >
              {currentWorkspace.subscription?.subscriptionPlan ||
                EnumSubscriptionPlan.Free}{" "}
              Plan
            </Chip>
            <WorkspaceSelector />
            {/* <Text textStyle={EnumTextStyle.H3}>{currentWorkspace.name}</Text> */}
          </FlexItem>
          <FlexItem.FlexEnd alignSelf={EnumContentAlign.Start}>
            {membersData && membersData.workspaceMembers && (
              <Button
                iconPosition={EnumIconPosition.Left}
                icon="users"
                buttonStyle={EnumButtonStyle.Text}
                as={Link}
                to={`/${currentWorkspace.id}/members`}
              >
                {membersCount} members
              </Button>
            )}
          </FlexItem.FlexEnd>
        </FlexItem>
      </Panel>
      <FlexItem
        className={`${CLASS_NAME}__content`}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Stretch}
      >
        <ProjectList
          projects={projectsList}
          workspaceId={currentWorkspace.id}
        />
        <UsageInsights projectIds={projectIds} />
      </FlexItem>
    </PageContent>
  );
};

export default WorkspaceOverview;
