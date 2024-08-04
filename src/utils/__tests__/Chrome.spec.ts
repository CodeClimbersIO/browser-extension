import sinon from 'sinon'
import chrome from 'sinon-chrome'

describe('Chrome Dev Tools', function () {
  it('should work', function () {
    chrome.browserAction.setTitle({ title: 'hello' })
    sinon.assert.calledOnce(chrome.browserAction.setTitle)
  })
})
