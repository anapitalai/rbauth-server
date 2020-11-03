# rbauth-server
API with all the needed features

Roles
Email Verification
Rate limiting
Server using SSL
Realtime
2FAuth


##generate secret
require('crypto').randomBytes(64).toString('hex')



###git branching and merging
git branch  ---show branches
git branch name  ---new branch
git checkout name   ---move to the branch
git branch -d name  --delete a branch
git merge name  --merge a branch


##merging 
git chekout master ---switch to master
git merge name  ---merge the name branch to master
git push   --push to git github


How to generate a self signed certificate
--------------------------------------
#create a key
openssl genrsa -out sly-key.pem

#create a certificate request
openssl req -new -sha256 -key sly-key.pem -out sly-csr.pem
##
openssl x509 -req -in sly-csr.pem -signkey sly-key.pem -out sly-cert.pem

#create a key
openssl genrsa -out sly-key.pem

#create a certificate request
openssl req -new -sha256 -key sly-key.pem -out sly-csr.pem
##
openssl x509 -req -in sly-csr.pem -signkey sly-key.pem -out sly-cert.pem



