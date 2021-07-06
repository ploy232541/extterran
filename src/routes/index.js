import HomeScreen from "../screens/Home/HomeScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VideoListScreen from "../screens/Home/VideoListScreen";
import NewsListScreen from "../screens/Home/NewsListScreen";
import NewsDetailScreen from "../screens/Home/NewsDetailScreen";
import HowToUseListScreen from "../screens/Home/HowToUseListScreen";
import HowToUseDetailScreen from "../screens/Home/HowToUseDetailScreen";
import QandAListScreen from "../screens/Home/QandAListScreen";
import QandADetailScreen from "../screens/Home/QandADetailScreen";
import DownloadScreen from "../screens/Home/DownloadScreen";

import ProfileScreen from "../screens/Profile/ProfileScreen";
import OutfitScreen from "../screens/Profile/OutfitScreen";
import SafetyBootsScreen from "../screens/Profile/SafetyBootsScreen";
import MedicalCheckupsScreen from "../screens/Profile/MedicalCheckupsScreen";
import MainProfileScreen from "../screens/Profile/MainProfileScreen";

import TrainingScreen from "../screens/Training/TrainingScreen";
import TrainingFormScreen from "../screens/Training/TrainingFormScreen";
import TrainingStatusScreen from "../screens/Training/TrainingStatusScreen";
import TrainingStaffStatusScreen from "../screens/Training/TrainingStaffStatusScreen";
import TrainingNeedScreen from "../screens/Training/TrainingNeedScreen";
import InHouseScreen from "../screens/Training/InHouseScreen";
import ExternalScreen from "../screens/Training/ExternalScreen";

import BookingScreen from "../screens/Booking/BookingScreen";
import FlightBookingScreen from "../screens/Booking/FlightBookingScreen";
import AccommodationBookingScreen from "../screens/Booking/AccommodationBookingScreen";
import GroundTransportationBookingScreen from "../screens/Booking/GroundTransportationBookingScreen";

import LearningStatusListScreen from "../screens/LearningStatus/LearningStatusListScreen";

import MyExternalCourse from "../screens/MyProgram/MyExternalCourse";
import MyInternalCourse from "../screens/MyProgram/MyInternalCourse";
import MyGeneralCourse from "../screens/MyProgram/MyGeneralCourse";

import LibraryScreen from "../screens/Home/LibraryScreen";
import TabDocument from "../screens/Home/TabDocument";
import TabMultimedia from "../screens/Home/TabMultimedia";
import DocumentDetail from "../screens/Home/DocumentDetail";
import MultimediaDetail from "../screens/Home/MultimediaDetail";

import LearnScreen from "../screens/Course/LearnScreen";
import ExamDetailCourse from "../screens/Course/ExamDetailCourse";
import PreTestCourse from "../screens/Course/PreTestCourse";
import ResultCourseTest from "../screens/Course/ResultCourseTest";
import ExamDetailLesson from "../screens/Course/ExamDetailLesson";
import PreTest from "../screens/Course/PreTest";
import ResultTest from "../screens/Course/ResultTest";
import PostTest from "../screens/Course/PostTest";
import PostTestCourse from "../screens/Course/PostTestCourse";
import QQuestAns_course from "../screens/Course/QQuestAns_course";
import Vdo from "../screens/Course/Vdo";
import CourseCategory from "../screens/Course/CourseCategory";
import CousreScreenDetail from "../screens/Course/CousreScreenDetail";
import LearningStatusScreen from "../screens/LearningStatus/LearningStatusListScreen";
import WrapperComponent from "../screens/LearningStatus/WrapperComponent";
import CourseCategoryGeneral from "../screens/Course/CourseCategoryGeneral";
import CousreScreenDetailGeneral from "../screens/Course/CousreScreenDetailGeneral";

import StaffCourseInScreen from '../screens/Staff/StaffCourseInScreen'
import StaffCourseGeneralScreen from '../screens/Staff/StaffCourseGeneralScreen'

import ConfirmBookingScreen from '../screens/Staff/ConfirmBookingScreen'
import ConfirmTrainingScreen from '../screens/Staff/ConfirmTrainingScreen'
import StaffForm from '../screens/Staff/StaffForm'
import StaffFormFlight from '../screens/Staff/StaffFormFlight'
import StaffFormAccom from '../screens/Staff/StaffFormAccom'
import StaffFormGround from '../screens/Staff/StaffFormGround'
import FeedBackCourseInScreen from '../screens/FeedBack/FeedBackCourseInScreen'
import FeedBackCourseGeneralScreen from '../screens/FeedBack/FeedBackCourseGeneralScreen'
import CourseScreenDetailOut from '../screens/Course/CourseScreenDetailOut'

const routes = {
  HomeScreen: { title: " ", component: HomeScreen },
  ForgotPasswordScreen: { title: " ", component: ForgotPasswordScreen },
  VideoListScreen: { title: " ", component: VideoListScreen },
  NewsListScreen: { title: " ", component: NewsListScreen },
  NewsDetailScreen: { title: " ", component: NewsDetailScreen },
  HowToUseListScreen: { title: " ", component: HowToUseListScreen },
  HowToUseDetailScreen: {
    title: " ",
    component: HowToUseDetailScreen,
  },
  QandAListScreen: { title: " ", component: QandAListScreen },
  QandADetailScreen: { title: " ", component: QandADetailScreen },
  DownloadScreen: { title: " ", component: DownloadScreen },

  ProfileScreen: { title: " ", component: ProfileScreen },
  OutfitScreen: { title: " ", component: OutfitScreen },
  SafetyBootsScreen: { title: " ", component: SafetyBootsScreen },
  MedicalCheckupsScreen: {
    title: " ",
    component: MedicalCheckupsScreen,
  },
  MainProfileScreen: {
    title: " ",
    component: MainProfileScreen,
  },

  TrainingScreen: { title: " ", component: TrainingScreen },
  TrainingFormScreen: { title: " ", component: TrainingFormScreen },
  TrainingStatusScreen: {
    title: " ",
    component: TrainingStatusScreen,
  },
  TrainingStaffStatusScreen: {
    title: " ",
    component: TrainingStaffStatusScreen,
  },
  TrainingNeedScreen: { title: " ", component: TrainingNeedScreen },
  InHouseScreen: { title: " ", component: InHouseScreen },
  ExternalScreen: { title: " ", component: ExternalScreen },

  BookingScreen: { title: " ", component: BookingScreen },
  FlightBookingScreen: { title: " ", component: FlightBookingScreen },
  AccommodationBookingScreen: {
    title: " ",
    component: AccommodationBookingScreen,
  },
  GroundTransportationBookingScreen: {
    title: " ",
    component: GroundTransportationBookingScreen,
  },
  
  LearningStatusListScreen: {
    title: " ",
    component: LearningStatusListScreen,
  },

  MyExternalCourse:{
    title: " ",
    component: MyExternalCourse,
  },
  MyInternalCourse:{
    title: " ",
    component: MyInternalCourse
  },
  MyGeneralCourse:{
    title:" ",
    component:MyGeneralCourse
  },

  LibraryScreen:{
    title:" ",
    component:LibraryScreen
  },

  TabDocument:{
    title:" ",
    component:TabDocument
  },
  TabMultimedia:{
    title:" ",
    component:TabMultimedia
  },
  DocumentDetail:{
    title:" ",
    component:DocumentDetail
  },
  MultimediaDetail:{
    title:" ",
    component:MultimediaDetail
  },
  LearnScreen:{
    title:" ",
    component:LearnScreen
  },
  ExamDetailCourse:{
    title:" ",
    component:ExamDetailCourse
  },
  PreTestCourse:{
    title:" ",
    component:PreTestCourse
  },
  ResultCourseTest:{
    title:" ",
    component:ResultCourseTest
  },
  ExamDetailLesson:{
    title:" ",
    component:ExamDetailLesson
  },
  PreTest:{
    title:" ",
    component:PreTest
  },
  ResultTest:{
    title:" ",
    component:ResultTest
  },
  PostTest:{
    title:" ",
    component:PostTest
  },
  PostTestCourse:{
    title:" ",
    component:PostTestCourse
  },
  QQuestAns_course:{
    title:" ",
    component:QQuestAns_course
  },
  Vdo:{
    title:" ",
    component:Vdo
  },

  CourseCategory:{
    title:" ",
    component:CourseCategory
  },

  CousreScreenDetail:{
    title:" ",
    component:CousreScreenDetail
  },

  LearningStatusScreen:{
    title:" ",
    component:LearningStatusScreen
  },

  WrapperComponent:{
    title:" ",
    component:WrapperComponent
  },

  CourseCategoryGeneral:{
    title:" ",
    component:CourseCategoryGeneral
  },

  CousreScreenDetailGeneral:{
    title:" ",
    component:CousreScreenDetailGeneral
  },

  StaffCourseInScreen:{
    title:" ",
    component:StaffCourseInScreen
  },
  StaffCourseGeneralScreen:{
    title:" ",
    component:StaffCourseGeneralScreen
  },
  
  ConfirmTrainingScreen:{
    title:" ",
    component:ConfirmTrainingScreen
  },
  ConfirmBookingScreen:{
    title:" ",
    component:ConfirmBookingScreen
  },
  StaffForm:{
    title:" ",
    component:StaffForm
  },
  StaffFormFlight:{
    title:" ",
    component:StaffFormFlight
  },StaffFormAccom:{
    title:" ",
    component:StaffFormAccom
  },StaffFormGround:{
    title:" ",
    component:StaffFormGround
  },

  FeedBackCourseInScreen:{
    title:" ",
    component:FeedBackCourseInScreen
  },

  FeedBackCourseGeneralScreen:{
    title:" ",
    component:FeedBackCourseGeneralScreen
  },

  CourseScreenDetailOut:{
    title:" ",
    component:CourseScreenDetailOut
  }
  
};

export default routes;
