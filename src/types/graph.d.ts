export const typeDefs = ["type Mutation {\n  addBountyExclusions(valueList: [String]): Boolean\n  registerBountyExclusionToProgram(eIdList: [Int], bId: String): Boolean\n  initBugBountyProgram(companyName: String, isPrivate: Boolean): String\n  modifyBugBountyProgram(bbpId: String!, isPrivate: Boolean, disclosurePolicy: String, isOpen: Boolean, openDateYear: Int, openDateMonth: Int, openDateDay: Int, closeDateYear: Int, closeDateMonth: Int, closeDateDay: Int, lowPriceMin: Int, lowPriceMax: Int, mediumPriceMin: Int, mediumPriceMax: Int, highPriceMin: Int, highriceMax: Int, fatalPriceMin: Int, fatalPriceMax: Int, introduction: String, managedBy: String): Boolean\n  registerCompany(companyName: String!, nameId: String!, webPageUrl: String, description: String): Boolean\n  addFileObj(fileName: String!): String\n  addLogoFileObj(companyId: String!, fileName: String!): String\n  addProfileFileObj(fileName: String!): String\n  addReportFileObj(reportId: String!, fileName: String!): String\n  registerInScopeList(inScopeTargetStringList: [String], bbpId: String!): Boolean\n  registerOutOfScopeList(outOfScopeTargetStringList: [String], bbpId: String!): Boolean\n  addProgramRules(valueList: [String]): Boolean\n  registerProgramRulesToProgram(pIdList: [Int], bId: String): Boolean\n  evaluateReport(rId: String!, bountyAmount: Int, grantedCredit: Int, vulLevel: Int, cvssScore: Float, writingScore: Float, evaluationText: String): String\n  modifyProgress(rId: String!, progressIdx: Int!): String\n  modifyReportResult(rId: String!, resultCode: String!): String\n  submitReport(bbpId: String, nameId: String, targetId: Int!, vId: Int!, attackComplexity: Int, requiredPriv: Int, userInteraction: Int, confidentiality: Int, integrity: Int, availablity: Int, title: String, location: String, enviroment: String, description: String!, dump: String, additionalText: String, collaboratorInfoList: [collaboratorInfo]): String\n  addComment(content: String!, rId: String!, fileId: String): String\n  addReportTips(valueList: [String]): Boolean\n  registerReportTipsToProgram(rIdList: [Int], bId: String): Boolean\n  allowAccount(userId: String!): Boolean\n  confirmSecret(authSecret: String!): ConfirmSecretResponse\n  modifyPassword(oldPassword: String!, newPassword: String!): Boolean\n  registerAccount(realName: String, nickName: String!, password: String!, email: String!, phoneNumber: String): Boolean\n  registerAccountForBusiness(realName: String, nickName: String!, password: String!, email: String!, phoneNumber: String!, companyName: String!): Boolean\n  resendMail(email: String!): Boolean\n  resetPasswordBySecret(key: String!, newPassword: String!): Boolean\n  sendPasswordResetMail(email: String!): Boolean\n  signIn(email: String!, password: String!): SignInResponse\n}\n\ntype reportInfo {\n  reportId: String!\n  status: String!\n  result: String\n  authorNickName: String\n  reportId: String!\n  status: String!\n  result: String\n  companyName: String\n  submitDate: DateTime\n  vulName: String\n}\n\ntype getBusinessBountyPageResponse {\n  submittedReportCount: Int!\n  totalVulnerabilityCount: Int!\n  rewardedVulnerabilityCount: Int!\n  totalReward: Int!\n  joinedHackerCount: Int!\n  closeDate: DateTime\n  openDate: DateTime\n  firstReportDate: DateTime\n  recentReportDate: DateTime\n  reportInfoList: [reportInfo]\n}\n\ntype Query {\n  getBusinessBountyPage(bbpId: String, nameId: String): getBusinessBountyPageResponse\n  getPoicyInfo(arg1: Boolean): Boolean\n  getProgramBanner(bbpId: String, nameId: String): getProgramBannerResponse\n  getProgramBodyContents(bbpId: String, nameId: String): getProgramBodyContentsResponse\n  getProgramList: [programInfoForPublic]\n  getReportReadyPage(bbpId: String, nameId: String): getReportReadyPageResponse\n  getSideNotices(arg1: Boolean): Boolean\n  getSubmittedReports(arg1: Boolean): Boolean\n  getAllCompanyLogos: [companyLogoInfo]\n  checkFileInfo(userId: String, fileId: String!): checkFileInfoResponse\n  getReportContent(rId: String!): getReportContentResponse\n  getReportTotalStatus(rId: String!): getReportTotalStatusResponse\n  getReportComments(arg1: Boolean): Boolean\n  getMyProfile: getMyProfileResponse\n  isEmailDuplicated(email: String!): Boolean\n  isNickNameDuplicated(nickName: String!): Boolean\n}\n\ntype getProgramBannerResponse {\n  isPrivate: Boolean\n  companyName: String\n  description: String\n  webPageUrl: String\n  submittedReportCount: Int!\n  bountyMin: Int!\n  bountyMax: Int!\n  logoId: String\n  managedBy: String\n}\n\ntype scopeTargetResponse {\n  type: String\n  value: String\n  id: Int\n  type: String\n  value: String\n}\n\ntype getProgramBodyContentsResponse {\n  disclosurePolicy: String!\n  introduction: String!\n  ruleValueList: [String]\n  openDate: DateTime\n  closeDate: DateTime\n  lowPriceMin: Int!\n  lowPriceMax: Int!\n  mediumPriceMin: Int!\n  mediumPriceMax: Int!\n  highPriceMin: Int!\n  highriceMax: Int!\n  fatalPriceMin: Int!\n  fatalPriceMax: Int!\n  inScopeTargetList: [scopeTargetResponse]\n  outOfScopeTargetList: [scopeTargetResponse]\n  exclusionValueList: [String]\n}\n\ntype programInfoForPublic {\n  logoId: String\n  companyName: String!\n  nameId: String!\n  description: String\n  inScopeTypeList: [String]\n  bountyMin: Int!\n  bountyMax: Int!\n  managedBy: String\n}\n\ntype getReportReadyPageResponse {\n  reportTipList: [String]\n  disclosurePolicy: String\n  vulnerabilityList: [Vulnerability]\n  openDate: DateTime\n  closeDate: DateTime\n  inScopeTargetList: [scopeTargetResponse]\n}\n\ntype companyLogoInfo {\n  id: String!\n  companyName: String!\n  nameId: String!\n  logoId: String\n}\n\ntype checkFileInfoResponse {\n  ok: Boolean!\n  fileType: String\n  fileName: String\n  category: String\n}\n\nscalar DateTime\n\ntype Vulnerability {\n  id: Int!\n  category: String!\n  name: String!\n  note: String\n  createdAt: DateTime\n  updatedAt: DateTime\n}\n\ntype getReportContentResponse {\n  fileId: String\n  nameId: String!\n  profilePicId: String\n  authorNickName: String!\n  vulName: String\n  assetName: String\n  title: String\n  description: String\n  cvssScore: Int\n  additionalText: String\n  location: String\n  enviroment: String\n  dump: String\n}\n\ntype commentInfo {\n  id: String!\n  content: String!\n  writerNickName: String!\n  profilePicId: String\n  fileId: String\n}\n\ntype getReportTotalStatusResponse {\n  nameId: String\n  authorNickName: String\n  progressStatus: Int!\n  resultCode: String\n  bountyAmount: Int\n  grantedCredit: Int\n  commentInfoList: [commentInfo]\n}\n\ninput collaboratorInfo {\n  userId: String!\n  contributionRatio: Int\n}\n\ntype ConfirmSecretResponse {\n  ok: Boolean!\n  error: String\n  token: String\n}\n\ntype getMyProfileResponse {\n  role: String!\n  email: String!\n  nickName: String!\n  profilePictureId: String\n  credit: Int\n  numOfVul: Int\n  reportInfoList: [reportInfo]\n}\n\ntype SignInResponse {\n  ok: Boolean!\n  error: String\n  token: String\n}\n"];
/* tslint:disable */

export interface Query {
  getBusinessBountyPage: getBusinessBountyPageResponse | null;
  getPoicyInfo: boolean | null;
  getProgramBanner: getProgramBannerResponse | null;
  getProgramBodyContents: getProgramBodyContentsResponse | null;
  getProgramList: Array<programInfoForPublic> | null;
  getReportReadyPage: getReportReadyPageResponse | null;
  getSideNotices: boolean | null;
  getSubmittedReports: boolean | null;
  getAllCompanyLogos: Array<companyLogoInfo> | null;
  checkFileInfo: checkFileInfoResponse | null;
  getReportContent: getReportContentResponse | null;
  getReportTotalStatus: getReportTotalStatusResponse | null;
  getReportComments: boolean | null;
  getMyProfile: getMyProfileResponse | null;
  isEmailDuplicated: boolean | null;
  isNickNameDuplicated: boolean | null;
}

export interface GetBusinessBountyPageQueryArgs {
  bbpId: string | null;
  nameId: string | null;
}

export interface GetPoicyInfoQueryArgs {
  arg1: boolean | null;
}

export interface GetProgramBannerQueryArgs {
  bbpId: string | null;
  nameId: string | null;
}

export interface GetProgramBodyContentsQueryArgs {
  bbpId: string | null;
  nameId: string | null;
}

export interface GetReportReadyPageQueryArgs {
  bbpId: string | null;
  nameId: string | null;
}

export interface GetSideNoticesQueryArgs {
  arg1: boolean | null;
}

export interface GetSubmittedReportsQueryArgs {
  arg1: boolean | null;
}

export interface CheckFileInfoQueryArgs {
  userId: string | null;
  fileId: string;
}

export interface GetReportContentQueryArgs {
  rId: string;
}

export interface GetReportTotalStatusQueryArgs {
  rId: string;
}

export interface GetReportCommentsQueryArgs {
  arg1: boolean | null;
}

export interface IsEmailDuplicatedQueryArgs {
  email: string;
}

export interface IsNickNameDuplicatedQueryArgs {
  nickName: string;
}

export interface getBusinessBountyPageResponse {
  submittedReportCount: number;
  totalVulnerabilityCount: number;
  rewardedVulnerabilityCount: number;
  totalReward: number;
  joinedHackerCount: number;
  closeDate: DateTime | null;
  openDate: DateTime | null;
  firstReportDate: DateTime | null;
  recentReportDate: DateTime | null;
  reportInfoList: Array<reportInfo> | null;
}

export type DateTime = any;

export interface reportInfo {
  reportId: string;
  status: string;
  result: string | null;
  authorNickName: string | null;
  companyName: string | null;
  submitDate: DateTime | null;
  vulName: string | null;
}

export interface getProgramBannerResponse {
  isPrivate: boolean | null;
  companyName: string | null;
  description: string | null;
  webPageUrl: string | null;
  submittedReportCount: number;
  bountyMin: number;
  bountyMax: number;
  logoId: string | null;
  managedBy: string | null;
}

export interface getProgramBodyContentsResponse {
  disclosurePolicy: string;
  introduction: string;
  ruleValueList: Array<string> | null;
  openDate: DateTime | null;
  closeDate: DateTime | null;
  lowPriceMin: number;
  lowPriceMax: number;
  mediumPriceMin: number;
  mediumPriceMax: number;
  highPriceMin: number;
  highriceMax: number;
  fatalPriceMin: number;
  fatalPriceMax: number;
  inScopeTargetList: Array<scopeTargetResponse> | null;
  outOfScopeTargetList: Array<scopeTargetResponse> | null;
  exclusionValueList: Array<string> | null;
}

export interface scopeTargetResponse {
  type: string | null;
  value: string | null;
  id: number | null;
}

export interface programInfoForPublic {
  logoId: string | null;
  companyName: string;
  nameId: string;
  description: string | null;
  inScopeTypeList: Array<string> | null;
  bountyMin: number;
  bountyMax: number;
  managedBy: string | null;
}

export interface getReportReadyPageResponse {
  reportTipList: Array<string> | null;
  disclosurePolicy: string | null;
  vulnerabilityList: Array<Vulnerability> | null;
  openDate: DateTime | null;
  closeDate: DateTime | null;
  inScopeTargetList: Array<scopeTargetResponse> | null;
}

export interface Vulnerability {
  id: number;
  category: string;
  name: string;
  note: string | null;
  createdAt: DateTime | null;
  updatedAt: DateTime | null;
}

export interface companyLogoInfo {
  id: string;
  companyName: string;
  nameId: string;
  logoId: string | null;
}

export interface checkFileInfoResponse {
  ok: boolean;
  fileType: string | null;
  fileName: string | null;
  category: string | null;
}

export interface getReportContentResponse {
  fileId: string | null;
  nameId: string;
  profilePicId: string | null;
  authorNickName: string;
  vulName: string | null;
  assetName: string | null;
  title: string | null;
  description: string | null;
  cvssScore: number | null;
  additionalText: string | null;
  location: string | null;
  enviroment: string | null;
  dump: string | null;
}

export interface getReportTotalStatusResponse {
  nameId: string | null;
  authorNickName: string | null;
  progressStatus: number;
  resultCode: string | null;
  bountyAmount: number | null;
  grantedCredit: number | null;
  commentInfoList: Array<commentInfo> | null;
}

export interface commentInfo {
  id: string;
  content: string;
  writerNickName: string;
  profilePicId: string | null;
  fileId: string | null;
}

export interface getMyProfileResponse {
  role: string;
  email: string;
  nickName: string;
  profilePictureId: string | null;
  credit: number | null;
  numOfVul: number | null;
  reportInfoList: Array<reportInfo> | null;
}

export interface Mutation {
  addBountyExclusions: boolean | null;
  registerBountyExclusionToProgram: boolean | null;
  initBugBountyProgram: string | null;
  modifyBugBountyProgram: boolean | null;
  registerCompany: boolean | null;
  addFileObj: string | null;
  addLogoFileObj: string | null;
  addProfileFileObj: string | null;
  addReportFileObj: string | null;
  registerInScopeList: boolean | null;
  registerOutOfScopeList: boolean | null;
  addProgramRules: boolean | null;
  registerProgramRulesToProgram: boolean | null;
  evaluateReport: string | null;
  modifyProgress: string | null;
  modifyReportResult: string | null;
  submitReport: string | null;
  addComment: string | null;
  addReportTips: boolean | null;
  registerReportTipsToProgram: boolean | null;
  allowAccount: boolean | null;
  confirmSecret: ConfirmSecretResponse | null;
  modifyPassword: boolean | null;
  registerAccount: boolean | null;
  registerAccountForBusiness: boolean | null;
  resendMail: boolean | null;
  resetPasswordBySecret: boolean | null;
  sendPasswordResetMail: boolean | null;
  signIn: SignInResponse | null;
}

export interface AddBountyExclusionsMutationArgs {
  valueList: Array<string> | null;
}

export interface RegisterBountyExclusionToProgramMutationArgs {
  eIdList: Array<number> | null;
  bId: string | null;
}

export interface InitBugBountyProgramMutationArgs {
  companyName: string | null;
  isPrivate: boolean | null;
}

export interface ModifyBugBountyProgramMutationArgs {
  bbpId: string;
  isPrivate: boolean | null;
  disclosurePolicy: string | null;
  isOpen: boolean | null;
  openDateYear: number | null;
  openDateMonth: number | null;
  openDateDay: number | null;
  closeDateYear: number | null;
  closeDateMonth: number | null;
  closeDateDay: number | null;
  lowPriceMin: number | null;
  lowPriceMax: number | null;
  mediumPriceMin: number | null;
  mediumPriceMax: number | null;
  highPriceMin: number | null;
  highriceMax: number | null;
  fatalPriceMin: number | null;
  fatalPriceMax: number | null;
  introduction: string | null;
  managedBy: string | null;
}

export interface RegisterCompanyMutationArgs {
  companyName: string;
  nameId: string;
  webPageUrl: string | null;
  description: string | null;
}

export interface AddFileObjMutationArgs {
  fileName: string;
}

export interface AddLogoFileObjMutationArgs {
  companyId: string;
  fileName: string;
}

export interface AddProfileFileObjMutationArgs {
  fileName: string;
}

export interface AddReportFileObjMutationArgs {
  reportId: string;
  fileName: string;
}

export interface RegisterInScopeListMutationArgs {
  inScopeTargetStringList: Array<string> | null;
  bbpId: string;
}

export interface RegisterOutOfScopeListMutationArgs {
  outOfScopeTargetStringList: Array<string> | null;
  bbpId: string;
}

export interface AddProgramRulesMutationArgs {
  valueList: Array<string> | null;
}

export interface RegisterProgramRulesToProgramMutationArgs {
  pIdList: Array<number> | null;
  bId: string | null;
}

export interface EvaluateReportMutationArgs {
  rId: string;
  bountyAmount: number | null;
  grantedCredit: number | null;
  vulLevel: number | null;
  cvssScore: number | null;
  writingScore: number | null;
  evaluationText: string | null;
}

export interface ModifyProgressMutationArgs {
  rId: string;
  progressIdx: number;
}

export interface ModifyReportResultMutationArgs {
  rId: string;
  resultCode: string;
}

export interface SubmitReportMutationArgs {
  bbpId: string | null;
  nameId: string | null;
  targetId: number;
  vId: number;
  attackComplexity: number | null;
  requiredPriv: number | null;
  userInteraction: number | null;
  confidentiality: number | null;
  integrity: number | null;
  availablity: number | null;
  title: string | null;
  location: string | null;
  enviroment: string | null;
  description: string;
  dump: string | null;
  additionalText: string | null;
  collaboratorInfoList: Array<collaboratorInfo> | null;
}

export interface AddCommentMutationArgs {
  content: string;
  rId: string;
  fileId: string | null;
}

export interface AddReportTipsMutationArgs {
  valueList: Array<string> | null;
}

export interface RegisterReportTipsToProgramMutationArgs {
  rIdList: Array<number> | null;
  bId: string | null;
}

export interface AllowAccountMutationArgs {
  userId: string;
}

export interface ConfirmSecretMutationArgs {
  authSecret: string;
}

export interface ModifyPasswordMutationArgs {
  oldPassword: string;
  newPassword: string;
}

export interface RegisterAccountMutationArgs {
  realName: string | null;
  nickName: string;
  password: string;
  email: string;
  phoneNumber: string | null;
}

export interface RegisterAccountForBusinessMutationArgs {
  realName: string | null;
  nickName: string;
  password: string;
  email: string;
  phoneNumber: string;
  companyName: string;
}

export interface ResendMailMutationArgs {
  email: string;
}

export interface ResetPasswordBySecretMutationArgs {
  key: string;
  newPassword: string;
}

export interface SendPasswordResetMailMutationArgs {
  email: string;
}

export interface SignInMutationArgs {
  email: string;
  password: string;
}

export interface collaboratorInfo {
  userId: string;
  contributionRatio: number | null;
}

export interface ConfirmSecretResponse {
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface SignInResponse {
  ok: boolean;
  error: string | null;
  token: string | null;
}
