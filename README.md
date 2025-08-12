# PorePal

Using AI to make personalized skincare reccomendations

## TODO:
- [ ] deploy roboflow model on roboflow api
- [ ] move it back into the vercel/flask backend?
- [ ] replace detection.py logic and those calls by calling roboflow api
- [ ] recheck and redeploy everything

## Notes:

- can host roboflow models on roboflow
- currently uploaded model to roboflow, still haven't deployed it yet
- possibly learn docker and bundle front-end and back-end into one docker image?
- vercel doesn't support agsi, so it can't support fastapi natively, does support flask thouhg
- agsi (fastapi, new django, etc.) vs wgsi (flask, old docker, etc.), agsi supports async await, wgsi doesn't
- railway for deploying docker image
- if want to stick with fastapi, need to deploy seperately (render?)
- alternative is to bundle together in nextjs deployment under flask
