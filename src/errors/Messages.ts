const Messages = {
  ID_IS_REQUIRED: "Id is required!",
  /**
   * General Error Messages
   */
  FILE_REQUIRED: "File is required!",
  NOT_IMPLEMENTED_ERROR: "Not Implemented!",
  LANGUAGE_CODE_REQUIRED: "Locale required",
  SERVICE_UNAVAILABLE_ERROR: "Service Unavailable!",
  FORBIDDEN_ERROR: "Authorization Failure: You're not allowed!",
  INTERNAL_SERVER_ERROR: "Internal Error: Something went wrong!",
  IMAGE_INVALID_TYPE: "Only .png, .jpg and .jpeg format allowed!",
  UNAUTHORIZED_ERROR: "Authorization Failure: Incorrect credentials!",
  PASSWORD_CHANGED_SUCCESSFULLY: "Password changed successfully!",

  /**
   * IAM Error Messages
   */
  PASSWORD_INCORRECT: "Incorrect password!",
  USERNAME_REQUIRED: "Username is required!",
  PASSWORD_REQUIRED: "Password is required!",
  NEW_PASSWORD_REQUIRED: "New password is required!",
  CURRENT_PASSWORD_REQUIRED: "Current password is required!",
  AUTHENTICATION_ERROR: "Login Failed: Invalid email or password!",
  ACCOUNT_INACTIVE:
    "Your account is not active! Please contact the system admin.",
  EMAIL_REQUIRED: "Email is required!",
  EMAIL_TAKEN: "Email is already taken!",
  FIRST_NAME_REQUIRED: "First name is required!",
  LAST_NAME_REQUIRED: "Last name is required!",
  INCORRECT_OLD_PASSWORD: "Incorrect old password!",
  /**
   * Language Error Messages
   */
  LANGUAGE_NOT_FOUND: "Language not found",
  LANGUAGE_NAME_REQUIRED: "Language name is required",
  LANGUAGE_EXISTS: "Language already exists",
  LANGAUGE_CODE_REQUIRED: "Locale is required",

  /**
   * Location Error Messages
   */
  LOCATION_NOT_FOUND: "Location not found",
  LOCATION_REGION_REQUIRED: "Region is required",
  LOCATION_ZONE_REQUIRED: "Zone is required",
  LOCATION_WOREDA_REQUIRED: "Woreda is required",
  LOCATION_KEBELE_REQUIRED: "Kebele is required",
  LOCATION_CITY_REQUIRED: "City is required",
  LOCATION_EXISTS: "Location already exists",
  LOCATION_NUMBER_OF_KEBELES_REQUIRED: "Number of kebeles is required",
  LOCATION_LANGUAG_CODE_REQUIRED: "Locale is required",
  /**
   * Setting Error Messages
   */
  SETTING_NOT_FOUND: "Setting not found",
  SETTING_NAME_REQUIRED: "Setting name is required",
  SETTING_VALUE_REQUIRED: "Setting value is required",
  SETTING_EXISTS: "Setting already exists",
  SETTING_LOCALE_REQUIRED: "Locale is required",

  /**
   * Role Related Error Messages
   */
  ROLE_NOT_FOUND: "Role not found",
  ROLE_NAME_REQUIRED: "Role is required",
  ROLE_ID_REQUIRED: "Role id is required",

  /**
   * Role Permission Related Error Messages
   */
  ROLE_PERMISSION_NOT_FOUND: "Role permission not found",
  ROLE_PERMISSION_ROLE_REQUIRED: "Role is required",
  ROLE_PERMISSION_PERMISSION_REQUIRED: "Permission is required",

  /**
   * Permission Related Error Messages
   */
  PERMISSION_NOT_FOUND: "Permission not found",
  PERMISSION_NAME_REQUIRED: "Permission is required",
  PERMISSION_TYPE_REQUIRED: "Type is required",
  PERMISSION_RESOURCE_REQUIRED: "Resource is required",

  /**
   * Policy Related Error Messages
   */
  POLICY_NOT_FOUND: "Policy not found",
  POLICY_USER_REQUIRED: "User is required",
  POLICY_ROLE_REQUIRED: "Role is required",

  /**
   * Unit Of Measurement Related Error Messages
   */
  UNIT_OF_MEASUREMENT_NOT_FOUND: "Unit of measurement not found!",
  UNIT_OF_MEASUREMENT_NAME_REQUIRED: "Name not found!",
  UNIT_OF_MEASUREMENT_LANGUAGE_CODE: "Locale not found!",
  UNIT_OF_MEASUREMENT_ALREADY_EXISTS: "Unit of measurement already exists!",
  /**
   * Sms Related Error Messages
   */
  SMS_NOT_FOUND: "Sms not found",
  /**
   * Notification Related Error Messages
   */
  NOTIFICATION_NOT_FOUND: "Notification not found",
  NOTIFICATION_NOT_SENT: "Notification not sent",
  NOTIFICATION_GROUP_BROADCAST_FAILED: "Notification broadcast failed",
  NOTIFICATION_USER_REQUIRED: "Notification user required",
  NOTIFICATION_TITLE_REQUIRED: "Notification title required",
  NOTIFICATION_BODY_REQUIRED: "Notification body required",
  NOTIFICATION_TYPE_REQUIRED: "Notification type required",
  NOTIFICATION_EXPIRY_DATE_REQUIRED: "Notification expiry date required",
  /**
   * Alert Related Error Messages
   */
  ALERT_NOT_FOUND: "Alert not found",
  ALERT_USER_REQUIRED: "Alert user required",
  ALERT_TITLE_REQUIRED: "Alert title required",
  ALERT_BODY_REQUIRED: "Alert body required",
  ALERT_TYPE_REQUIRED: "Alert type required",
  ALERT_EXPIRY_DATE_REQUIRED: "Alert expiry date required",
  /**
   * User Related Error Messages
   */
  USER_NOT_FOUND: "User not found",
  USER_OR_DEVICE_ID_NOT_FOUND: "User not found or doesn't have device id",
  USER_REQUIRED: "User is required",
  USER_ALREADY_EXISTS: "User already exists",
  USER_TYPE_REQUIRED: "User type is required",
  USER_TYPE_INVALID: "User type is invalid",
  USER_DEVICE_ID_REQUIRED: "Device is required",
  USER_PASSWORD_REQUIRED: "Password is required",
  USER_USERNAME_REQUIRED: "Username is required",
  USER_STATUS_REQUIRED: "User status is required",
  USER_EMAIL_REQUIRED: "Email is required",

  /**
   * User Type Related Error Messages
   */
  USER_TYPE_NOT_FOUND: "User type not found",

  /**
   * Farmer Related Error Messages
   */
  FARMER_NOT_FOUND: "Farmer not found",
  FARMER_OR_DEVICE_ID_NOT_FOUND: "Farmer not found or doesn't have device id",
  FARMER_REQUIRED: "Farmer is required",
  FARMER_ALREADY_EXISTS: "Farmer already exists",
  /**
   * FarmerLand Error Messages
   */
  ParcelNumber_LC_EXIST:
    " Farm Land With Specified Parcel Number Already Exist",
  FARM_LAND_NOT_FOUND: "Farm Land not found",
  FARM_LAND_ID_IS_REQUIRED: "Farm land id is required!",
  LAND_PREPARATION_DATE_IS_REQUIRED: "Land preparation date is required!",
  WEATHER_CONDITIONS_IS_REQUIRED: "Weather conditions is required!",
  LAND_PREPARATION_CONDITION_IS_REQUIRED:
    "Land preparation condition is required!",
  SELF_OR_SERVICES_IS_REQUIRED: "Self or services is required!",
  SEED_VARIETY_IS_REQUIRED: "Seed variety is required!",
  SEED_SOURCE_IS_REQUIRED: "Seed source is required!",
  SEED_QUANTITY_RECEIVED_IS_REQUIRED: "Seed quantity received is required!",
  SEED_QUANTITY_SOWN_IS_REQUIRED: "Seed quantity sown is required!",
  /**
   * Farmer Error Messages
   */
  FARMER_LAND_NOT_FOUND: "Farmer Land not found",

  /**
   * Farm Visit Report Error Messages
   */
  FARM_VISIT_REPORT_NOT_FOUND: "Farm Visit Report not found",

  /**
   * Cultivation Preparation Error Messages
   */
  CULTIVATION_PREPARATION_NOT_FOUND: "Cultivation Preparation not found",
  PREPARATION_ID_REQUIRED: "Preparation Id is required!",
  PREPARATION_STATUS_REQUIRED: "Preparation status is required!",
  PREPARATION_DATE_REQUIRED: "Preparation date is required!",
  PREPARATION_DONE_BY_REQUIRED: "Preparation done by is required!",
  PLANT_PROTECTION_DATE_REQUIRED: "Plant protection date is required!",
  PLANT_PROTECTION_DONE_BY_REQUIRED: "Plant protection done by is required!",
  FERTILIZATION_DATE_REQUIRED: "Fertilization date is required!",
  /**
   * Cultivation Observation Error Messages
   */
  CULTIVATION_OBSERVATION_NOT_FOUND: "Cultivation Observation not found",

  /**
   * Lookup category related erro message
   */
  LOOKUP_CATEGORY_NOT_FOUND: "Lookup category not found",
  LOOKUP_CATEGORY_NAME_REQUIRED: "Name is required",
  LOOKUP_CATEGORY_DESCRIPTION_REQUIRED: "Description is required",

  /**
   * Lookup related error message
   */
  LOOKUP_NOT_FOUND: "Lookup not found",
  LOOKUP_NAME_REQUIRED: "Lookup name is required",
  LOOKUP_DESCRIPTION_REQUIRED: "Description is required",
};

export default Messages;
