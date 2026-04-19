import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getUserStories } from '../api/api';
import { Router } from '@vaadin/router';

interface Story {
  story_id: number;
}

@customElement('story-sidebar')
export class StorySidebar extends LitElement {

  @state()
  private stories: Story[] = [];

  @state()
  private selectedId: number | null = null;

  static styles = css`
    :host {
      width: 260px;
      background: #202123;
      color: white;
      height: 100vh;
      overflow-y: auto;
      display: block;
    }

    .item {
      padding: 14px;
      cursor: pointer;
      border-bottom: 1px solid #2a2b32;
    }

    .item:hover {
      background: #2a2b32;
    }

    .active {
      background: #343541;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();

    this.stories = await getUserStories();

    if (this.stories.length > 0) {
      const latest = this.stories[this.stories.length - 1];

      this.selectedId = latest.story_id;
      Router.go(`/story/${latest.story_id}`);
    }
  }

  private selectStory(id: number) {
    this.selectedId = id;
    Router.go(`/story/${id}`);
  }

  render() {
    return html`
      ${this.stories.map(
        s => html`
          <div
            class="item ${this.selectedId === s.story_id ? 'active' : ''}"
            @click=${() => this.selectStory(s.story_id)}
          >
            Story ${s.story_id}
          </div>
        `
      )}
    `;
  }
}