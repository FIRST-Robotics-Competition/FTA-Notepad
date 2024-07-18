# Hub Documentation

## Overview

The SignalR hubs in the FMS Windows Services are responsible for handling real-time communication between FMS and the client devices. The hubs are implemented using the SignalR library,
which provides a simple and efficient way to establish bidirectional communication between clients and servers. We use MessagePack to serialize and deserialize the data sent between FMS
and the client devices, which allows for efficient and fast communication.

## Hubs

### FieldMonitorHub

The FieldMonitorHub is responsible for handling communication between FMS and the Field Monitor client devices. It provides real-time updates on the status of the field, including alliance
information, team status, connection status, and other relevant data. The hub sends updates to the clients when the data changes, allowing the Field Monitor devices to display the most
up-to-date information to the users.

#### MatchStatusInfoChanged

This method is called when  the match changes state. The argument is one object with the following keys per call:

* `MatchState`: `[Key("p1")]` - Enum indicating the current state of the match. Possible values are:
    * `NoCurrentlyActiveEvent` - 0
    * `NoCurrentlyActiveTournamentLevel` - 1
    * `WaitingForPrestart` - 2
    * `WaitingForPrestartTO` - 3
    * `Prestarting` - 4
    * `PrestartingTO` - 5
    * `WaitingForSetAudience` - 6
    * `WaitingForSetAudienceTO` - 7
    * `WaitingForMatchReady` - 8
    * `WaitingForMatchStart` - 9
    * `GameSpecificData` - 10
    * `MatchAuto` - 11
    * `MatchTransition` - 12
    * `MatchTeleop` - 13
    * `WaitingForCommit` - 14
    * `WaitingForPostResults` - 15
    * `TournamentLevelComplete` - 16
    * `MatchCancelled` - 17
    * `WaitingForMatchPreview` - 18
    * `WaitingForMatchPreviewTO` - 19
* `MatchNumber`: `[Key("p2")]` - Integer representing the match number.
* `PlayNumber`: `[Key("p3")]` - Integer representing the play number within the match.
* `Level`: `[Key("p4")]` - Enum indicating the tournament level. Possible values are:
    * `None` - 0, also used for test matches
    * `Practice` - 1
    * `Qualification` - 2
    * `Playoff` - 3

#### FieldMonitorDataChanged

This method is called when robot info changes, several times per second. The argument is an array of objects per call, each with following keys:

* `Alliance`: `[Key("p1")]` - Enum indicating the alliance type. Possible values are:
    * `None` - 0
    * `Red` - 1
    * `Blue` - 2
* `Station`: `[Key("p2")]` - Enum indicating the station type. Possible values are:
    * `None` - 0
    * `Station1` - 1
    * `Station2` - 2
    * `Station3` - 3
* `TeamNumber`: `[Key("p3")]` - Integer representing the team number.
* `Connection`: `[Key("p4")]` - Boolean indicating the stratix connection status.
* `LinkActive`: `[Key("p5")]` - Boolean indicating if the link is active.
* `DSLinkActive`: `[Key("p6")]` - Boolean indicating if the DS link is active.
* `RadioLink`: `[Key("p7")]` - Boolean indicating if the radio link is active.
* `RIOLink`: `[Key("p8")]` - Boolean indicating if the RIO link is active.
* `IsEnabled`: `[Key("p9")]` - Boolean indicating if it is enabled.
* `IsAuto`: `[Key("pa")]` - Boolean indicating if it is in auto mode.
* `IsBypassed`: `[Key("pb")]` - Boolean indicating if it is bypassed.
* `IsEStopPressed`: `[Key("pc")]` - Boolean indicating if the emergency stop is pressed.
* `IsEStopped`: `[Key("pd")]` - Boolean indicating if the emergency stop is active.
* `Battery`: `[Key("pe")]` - Decimal indicating the battery level.
* `MonitorStatus`: `[Key("pf")]` - Enum indicating the monitor status type. Possible values are:
    * `Unknown` - 0
    * `EStopped` - 1
    * `AStopped` - 2
    * `DisabledAuto` - 3
    * `DisabledTeleop` - 4
    * `EnabledAuto` - 5
    * `EnabledTeleop` - 6
* `AverageTripTime`: `[Key("pg")]` - Byte indicating the average trip time in milliseconds.
* `LostPackets`: `[Key("ph")]` - Integer indicating the number of lost packets.
* `Signal`: `[Key("pi")]` - Nullable integer indicating the signal strength.
* `Noise`: `[Key("pj")]` - Nullable integer indicating the noise level.
* `SNR`: `[Key("pk")]` - Integer indicating the signal-to-noise ratio.
* `Inactivity`: `[Key("pl")]` - Integer indicating inactivity in milliseconds.
* `MACAddress`: `[Key("pm")]` - String representing the MAC address.
* `TxRate`: `[Key("pn")]` - Nullable decimal indicating the transmission rate.
* `TxMCS`: `[Key("po")]` - Nullable integer indicating the transmission MCS.
* `TxMCSBandWidth`: `[Key("pp")]` - Nullable integer indicating the transmission MCS bandwidth.
* `TxVHT`: `[Key("pq")]` - Nullable boolean indicating if Tx VHT is active.
* `TxVHTNSS`: `[Key("pr")]` - Nullable integer indicating the Tx VHT NSS.
* `TxPackets`: `[Key("ps")]` - Integer indicating the number of transmitted packets.
* `RxRate`: `[Key("pt")]` - Nullable decimal indicating the reception rate.
* `RxMCS`: `[Key("pu")]` - Nullable integer indicating the reception MCS.
* `RxMCSBandWidth`: `[Key("pv")]` - Nullable integer indicating the reception MCS bandwidth.
* `RxVHT`: `[Key("pw")]` - Nullable boolean indicating if Rx VHT is active.
* `RxVHTNSS`: `[Key("px")]` - Nullable integer indicating the Rx VHT NSS.
* `RxPackets`: `[Key("py")]` - Integer indicating the number of received packets.
* `DataRateTotal`: `[Key("pz")]` - Decimal indicating the total data rate.
* `DataRateToRobot`: `[Key("paa")]` - Decimal indicating the data rate to the robot.
* `DataRateFromRobot`: `[Key("pbb")]` - Decimal indicating the data rate from the robot.
* `BWUtilization`: `[Key("pcc")]` - Enum indicating the bandwidth utilization type. Possible values are:
    * `Low` - 0
    * `Medium` - 1
    * `High` - 2
    * `VeryHigh` - 3
* `WPAKeyStatus`: `[Key("pdd")]` - Enum indicating the WPA key status. Possible values are:
    * `NotTested` - 0
    * `UsedInConnectionTest` - 1
    * `UsedInMatch` - 2
* `DriverStationIsOfficial`: `[Key("pee")]` - Boolean indicating if the driver station is official.
* `StationStatus`: `[Key("pff")]` - Enum indicating the driver station status. Possible values are:
    * `Good` - 0
    * `MoveStation` - 1
    * `Waiting` - 2, robot is not in this match
    * `Unknown` - 3
* `Brownout`: `[Key("pgg")]` - Boolean indicating if a brownout occurred.
* `EStopSource`: `[Key("phh")]` - String indicating the source of the emergency stop.
* `IsAStopPressed`: `[Key("pii")]` - Boolean indicating if an alternate stop is pressed.
* `IsAStopped`: `[Key("pjj")]` - Boolean indicating if an alternate stop is active.
* `MoveToStation`: `[Key("pjk")]` - String indicating the station to move to if required.

### FTAAppHub

This hub is responsible for sending notifications when FTA-related events occur. Currently, it only sends notifications when notes
change.

#### NoteChanged

This method is called when the a note is changed change. The argument is single object with the following keys:

* `NoteType`: `[Key("p1")]` - Enum representing the type of note. Possible values are:
    * `FTAEvent` - 1
    * `FTAMatch` - 2
    * `FTATeamIssue` - 3, this is a team in a specific match.
    * `FTAAppUsageData` - 4
    * `FTATeam` - 5, this is team independent of match.
    * `FMSAllianceTimeout` - 10 
    * `FMSMatchMaker` - 11 
    * `Staff` - 15
* `FMSNoteId`: `[Key("p2")]` - Guid representing the note ID.
* `RecordVersion`: `[Key("p3")]` Nullable long representing the record version.
* `Type`: `[Key("p4")]` Enum representng the type of event note change. Possible values are:
    * `Create` - 1
    * `Update` - 2
    * `Delete` - 3
* `FMSDeviceIdentification`: `[Key("p5")]` string representing the FMS device identification.
* `CurrentTimeStamp`: `[Key("p6")]` `DateTime` representing the current timestamp.
* `PreviousTimeStamp`: `[Key("p7")]` Nullable `DateTime` representing the previous timestamp.

#### MatchStatusInfoChanged

This is the same as the FieldMonitorHub's MatchStatusInfoChanged method.
