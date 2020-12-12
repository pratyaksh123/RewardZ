# Rewardz ![1426735](https://user-images.githubusercontent.com/55044774/101991573-ac373f80-3cd3-11eb-95ad-1847e3169ea0.png)
Earn while you learn !

### What ?
This apps lets you earn credits while you do payments like your fees,attend classes, learn stuff and solve assignments. You can later redeem those credits for coupons for various uses.

### Why ?
We have apps which reward you for payments, apps which reward you for paying bills on time but none promoting education.
Being currently in online scenario we will provide a way to motivate students and encourage them to attend classes and complete assignments and in turn will give them rewards.
This is where “Rewardz” comes into play. It rewards you for your hardwork and will help you gain more knowledge and benefits by using coupons.

### Tech Stack
- React Native , Firebase-Firestore , Cloud Functions

![Screenshot_1607789914](https://user-images.githubusercontent.com/55044774/101989226-ee0cb980-3cc4-11eb-955f-26f29f3224f8.png)
![Screenshot_1607789876](https://user-images.githubusercontent.com/55044774/101989252-12689600-3cc5-11eb-8856-d52892c24318.png)
![Screenshot_1607790163](https://user-images.githubusercontent.com/55044774/101989276-4479f800-3cc5-11eb-85af-f7b0964d80ac.png)
![Screenshot_1607789861](https://user-images.githubusercontent.com/55044774/101989316-90c53800-3cc5-11eb-887d-561572dd3c77.png)

###API Used
https://razorpay.com/docs/api/payments/



## Installation ( Android App )
- Download the apk from release artifacts [here](https://github.com/pratyaksh123/RewardZ/releases/tag/v1.0.1)


## Steps to setup locally and run:
If you run into any errors , refer to the Environment setup on the official React Native Docs - [Environment-Setup](https://reactnative.dev/docs/environment-setup)

* ### Install [Node.js](https://nodejs.org/en/download/current/)
> Deploying this app requires node package manager `npm` 

* ### Clone the repository
> Download this repository `or`
```
git clone https://github.com/pratyaksh123/RewardZ.git
cd RewardZ
```
* ### Install [yarn](https://yarnpkg.com/en/docs/install)
> Yarn is a dependency manager built by facebook and google. It is a more efficient and reliable (thanks to yarn.lock) alternative of npm.
- Launch ``` yarn ``` command in a terminal opened in the project folder.
> This command will look into the *package.json* file and install all the dependencies listed here.
- Install react-native-cli globally on your computer
```
yarn global add react-native-cli
```
* ### Android steps
Launch a virtual android device, for instance, by using [Android Studio](https://developer.android.com/studio/run/managing-avds.html#viewing)

> If you have never installed any android virtual device, [follow those instructions](https://developer.android.com/studio/run/managing-avds.html#createavd)

* ### Start the project with
```
react-native start
```
* ### Run `debug build`
```
react-native run-android
```
