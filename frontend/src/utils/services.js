import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from '../pages/Login/UserPool';

const receiveVerificationCode = process.env.REACT_APP_MFA_ENABLE;

export const onSubmit = async (data) => {
    const cognitoUser = new CognitoUser({
        Username: data.userName,
        Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
        Username: data.userName,
        Password: data.password,
    });

    return new Promise((resolve, reject) => { 
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: async (session) => {
                try {
                    if (receiveVerificationCode === 'true') {
                         await cognitoUser.getAttributeVerificationCode("email", {
                                onSuccess: () => resolve({ verifyCodeForm: true }),
                                onFailure: reject
                            }
                        );
                    } else {
                        const result = await getUserAttributes(cognitoUser);
                        resolve({ session, result });
                    }
                }catch (err) {
                    reject(err);
                }
            },
            newPasswordRequired: () => {
                return resolve({ newPasswordForm: true});
            },
            onFailure: reject
        });
    });
};

export const onFinish = async (data) => {
    const cognitoUser = new CognitoUser({
        Username: data.userName,
        Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
        Username: data.userName,
        Password: data.password,
    });

    return new Promise((resolve, reject) => { 
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: async (session) => {
                try {
                    await cognitoUser.verifyAttribute("email", data.verifyCode.trim(), {
                        onSuccess: async () => {
                            const result = await getUserAttributes(cognitoUser);
                            resolve({session,result});
                        },
                        onFailure: reject
                    })
                }catch (err) {
                    reject(err)
                }   
            },
            onFailure: reject
        })
    });
}

// Helper function to get user attributes
const getUserAttributes = (cognitoUser) => {
    return new Promise((resolve, reject) => {
        cognitoUser.getUserAttributes((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const getCurrentUser = () => {
    return UserPool.getCurrentUser();
};

export const handleUpdatePassword = (oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
        const user = getCurrentUser();
        if (user) {
          user.getSession((err) => {
            if (err) {
              reject(err)
            }
            // If session is valid, proceed with password change
            user.changePassword(oldPassword, newPassword, (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result);
            });
          });
        }
    })
};

export const handleNewPassword = async (data) => {
  const cognitoUser = new CognitoUser({
    Username: data.userName,
    Pool: UserPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(
      new AuthenticationDetails({
        Username: data.userName,
        Password: data.password,
      }),
      {
        newPasswordRequired: () => {
          cognitoUser.completeNewPasswordChallenge(
            data.newPassword,
            {},
            {
              onSuccess: () => resolve({ passwordChanged: true }),
              onFailure: reject,
            }
          );
        },
      }
    );
  });
};

export function getSessionExpiration() {
  const user = getCurrentUser();
  return new Promise((resolve, reject) => {
      if (user) {
          user.getSession((err, session) => {
              if (err) {
                  reject(err);
              } else {
                  const expiration = session.getAccessToken().getExpiration(); // in seconds
                  const currentTime = Math.floor(Date.now() / 1000); // in seconds
                  const remainingTime = expiration - currentTime;
                  resolve(remainingTime > 0 ? remainingTime * 1000 : 0); // return in ms
              }
          });
      } else {
          resolve(0); // no session
      }
  });
}

export const handleLogout = (setIsAuthenticated) => {
  const user = getCurrentUser();
  if (user) {
      user.signOut();
      setIsAuthenticated(false);
  }
};